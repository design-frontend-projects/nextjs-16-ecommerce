# Clerk Integration Setup Guide

Complete setup guide to integrate the role check system with Clerk authentication.

## 1. Install Clerk Dependencies

```bash
npm install @clerk/nextjs
# or
pnpm add @clerk/nextjs
```

## 2. Update Prisma Schema

Ensure your Prisma schema has the necessary fields for user management:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  password      String?   // Optional, use null for Clerk users
  isAdmin       Boolean   @default(false)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}
```

Run migration:

```bash
npx prisma migrate dev --name add_user_model
```

## 3. Set Environment Variables

Create `.env.local` file in your project root:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional: Clerk API URL (usually not needed)
# CLERK_API_URL=https://api.clerk.com

# Database
DATABASE_URL=your_database_url

# Next.js (optional, for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Get your keys from [Clerk Dashboard](https://dashboard.clerk.com)

## 4. Create Middleware

Create `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/dashboard/admin(.*)']);
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/profile(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Redirect to sign-in if visiting sign-in while authenticated
  if (userId && req.nextUrl.pathname === '/sign-in') {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
```

## 5. Update Root Layout

Update `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'E-Commerce App',
  description: 'Welcome to our e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## 6. Update Auth Layout

Update `src/app/auth/layout.tsx`:

```typescript
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
```

## 7. Create Sign-In Page

Create `src/app/auth/signin/page.tsx`:

```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-gray-600">Welcome back to our store</p>
      </div>
      <SignIn routing="path" path="/auth/signin" />
    </div>
  );
}
```

## 8. Create Sign-Up Page

Create `src/app/auth/signup/page.tsx`:

```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-gray-600">Join our community</p>
      </div>
      <SignUp routing="path" path="/auth/signup" />
    </div>
  );
}
```

## 9. Create User After Sign-Up (Webhook)

Set up a webhook to create a user in your database when they sign up in Clerk.

### In Clerk Dashboard:

1. Go to Developers → Webhooks
2. Create new endpoint pointing to `/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`

### Create API Route

Create `src/app/api/webhooks/clerk/route.ts`:

```typescript
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  if (!webhookSecret) {
    return new Response('Webhook secret is not configured', { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred - no svix headers', {
      status: 400,
    });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response('No email found', { status: 400 });
    }

    try {
      // Create or update user in database
      await prisma.user.upsert({
        where: { email },
        update: {
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          image: image_url || null,
        },
        create: {
          email,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          image: image_url || null,
          isAdmin: false, // New users are not admins by default
        },
      });

      return new Response('Webhook processed successfully', { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }

  return new Response('Event type not handled', { status: 200 });
}
```

Add webhook secret to `.env.local`:

```env
CLERK_WEBHOOK_SECRET=your_webhook_secret_from_clerk
```

## 10. Create Auth Route Handler

Create `src/app/api/auth/me/route.ts`:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          emailVerified: user.emailVerified?.toISOString() || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## 11. Usage Examples

### Server Component - Protected Admin Page

```typescript
// src/app/admin/page.tsx
import { checkUserRole } from '@/core/security/RoleCheckServer';

export default async function AdminPage() {
  const user = await checkUserRole(['admin'], '/dashboard');

  return (
    <div className="p-8">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
```

### Client Component - Conditional Rendering

```typescript
// src/components/AdminLink.tsx
'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';
import Link from 'next/link';
import type { CurrentUserProps } from '@/types';

export function AdminLink({ currentUser }: CurrentUserProps) {
  const { isAdmin } = useRoleCheck(currentUser);

  if (!isAdmin) {
    return null;
  }

  return <Link href="/admin">Admin Panel</Link>;
}
```

### Client Component - Using RoleCheck Component

```typescript
// src/app/settings/page.tsx
'use client';

import { RoleCheck } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function SettingsPage({ currentUser }: CurrentUserProps) {
  return (
    <div>
      <h1>Settings</h1>

      <RoleCheck
        allowedRoles={['admin']}
        currentUser={currentUser}
        redirectTo="/dashboard"
      >
        <section className="p-4 border rounded">
          <h2>Advanced Settings</h2>
          <p>Admin only features</p>
        </section>
      </RoleCheck>
    </div>
  );
}
```

## 12. Test the Setup

1. Start your development server:

```bash
npm run dev
```

2. Visit `http://localhost:3000/sign-in`
3. Sign up with a test account
4. Check Prisma Studio to verify user was created:

```bash
npx prisma studio
```

5. Update the user's `isAdmin` field to `true` in Prisma Studio
6. Visit protected admin route to test role checking

## 13. Make User Admin (via Database)

To make a user an admin, update their record in the database:

```typescript
// In your admin panel or via Prisma Studio
await prisma.user.update({
  where: { email: 'user@example.com' },
  data: { isAdmin: true },
});
```

## 14. Add UserButton to Navbar

Update your navbar to show user profile button:

```typescript
'use client';

import { UserButton, SignedOut, SignedIn } from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/">Logo</Link>

      <div className="flex gap-4 items-center">
        <SignedOut>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
```

## Troubleshooting

### User not found in database after sign-up

- Verify webhook is configured correctly in Clerk Dashboard
- Check webhook logs in Clerk Dashboard
- Manually create user in Prisma Studio

### getCurrentUser returns null in server components

- Ensure you're calling it in a Server Component (not marked with `'use client'`)
- Check that user is actually authenticated
- Verify Clerk middleware is set up correctly

### Role checks not working

- Verify `isAdmin` field is set correctly in database
- Clear browser cache and cookies
- Check browser console for errors
- Verify `getCurrentUser()` is returning correct data

## Next Steps

1. Create admin panel for managing users and roles
2. Set up role-based API endpoints
3. Add activity logging
4. Implement two-factor authentication
5. Create role management dashboard
