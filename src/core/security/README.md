# Role Check Functionality

Complete role-based access control (RBAC) solution for Next.js 16 application with both client-side and server-side utilities.

## Overview

This role check system provides:
- ✅ Client-side and server-side role checking
- ✅ Component wrapping with HOC (Higher Order Component)
- ✅ React Hook for easy integration
- ✅ Utility functions for flexible role validation
- ✅ Automatic redirects for unauthorized users
- ✅ Type-safe implementation with TypeScript

## Files

- **RoleCheck.tsx** - Client-side role checking (Component + HOC + utilities)
- **RoleCheckServer.ts** - Server-side role checking (utilities for Server Components)
- **useRoleCheck.ts** - Custom React hook for client components
- **ROLE_CHECK_EXAMPLES.ts** - Comprehensive usage examples

## User Roles

The system supports the following roles:

```typescript
type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
```

### Role Mapping

- **admin** - User with `isAdmin: true`
- **user** - Authenticated user
- **guest** - Non-authenticated user

## 1. Client-Side Usage

### Option A: RoleCheck Component

Wrap components to conditionally render based on user role:

```tsx
'use client';

import { RoleCheck } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function AdminPanel({ currentUser }: CurrentUserProps) {
  return (
    <RoleCheck 
      allowedRoles={['admin']} 
      currentUser={currentUser}
      redirectTo="/dashboard"
    >
      <div className="p-8">
        <h1>Admin Panel</h1>
      </div>
    </RoleCheck>
  );
}
```

#### RoleCheck Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| children | ReactNode | Content to render if authorized | - |
| allowedRoles | UserRole[] | Array of allowed roles | - |
| currentUser | CurrentUserProps['currentUser'] | Current user object | - |
| redirectTo | string | Redirect path if unauthorized | '/dashboard' |
| fallback | ReactNode | Content to show if unauthorized (instead of redirect) | undefined |

### Option B: withRoleCheck HOC

Wrap component as higher-order component:

```tsx
import { withRoleCheck } from '@/core/security/RoleCheck';

function AdminDashboard() {
  return <div>Admin Content</div>;
}

export default withRoleCheck(
  AdminDashboard,
  ['admin'],
  '/dashboard'
);
```

### Option C: useRoleCheck Hook

Use in client components for reactive role checking:

```tsx
'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';
import type { CurrentUserProps } from '@/types';

export default function Settings({ currentUser }: CurrentUserProps) {
  const { 
    isAdmin, 
    isUser, 
    userRole,
    checkRole,
    checkAnyRole,
    requireRole,
    requireAnyRole 
  } = useRoleCheck(currentUser);

  // Check if user is admin
  if (isAdmin) {
    // Show admin features
  }

  // Check specific role
  if (checkRole('admin')) {
    // Render admin controls
  }

  // Check if user has any of the roles
  if (checkAnyRole(['admin', 'moderator'])) {
    // Render for admins and moderators
  }

  // Require role with redirect
  const handleAdminAction = () => {
    if (requireRole('admin', '/unauthorized')) {
      // Perform admin action
    }
  };

  return <div>Settings Page</div>;
}
```

#### useRoleCheck Return Object

| Property | Type | Description |
|----------|------|-------------|
| userRole | UserRole \| null | Current user's role |
| isLoading | boolean | Loading state |
| isAdmin | boolean | Is user admin? |
| isUser | boolean | Is user regular user? |
| isGuest | boolean | Is user guest? |
| checkRole | (role: UserRole) => boolean | Check single role |
| checkAnyRole | (roles: UserRole[]) => boolean | Check multiple roles |
| requireRole | (role: UserRole, redirectTo?: string) => boolean | Check role with redirect |
| requireAnyRole | (roles: UserRole[], redirectTo?: string) => boolean | Check multiple roles with redirect |

### Option D: Utility Functions

Use utility functions for direct role checking:

```tsx
'use client';

import { 
  hasRole, 
  hasAnyRole, 
  getUserRole,
  getAvailableRoles 
} from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function Page({ currentUser }: CurrentUserProps) {
  // Check single role
  const isAdmin = hasRole(currentUser, 'admin');
  
  // Check multiple roles
  const canEdit = hasAnyRole(currentUser, ['admin', 'moderator']);
  
  // Get user role
  const role = getUserRole(currentUser);

  return (
    <div>
      {isAdmin && <AdminSection />}
      {canEdit && <EditButton />}
    </div>
  );
}
```

## 2. Server-Side Usage

### Option A: checkUserRole Function

Automatically redirect unauthorized users in Server Components:

```tsx
import { checkUserRole } from '@/core/security/RoleCheckServer';

export default async function AdminPage() {
  // Throws redirect if user is not admin
  const user = await checkUserRole(['admin'], '/dashboard');

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome {user.name}</p>
    </div>
  );
}
```

### Option B: Server Utility Functions

Use utility functions in Server Components or API routes:

```tsx
import { getCurrentUser } from '@/lib/auth';
import { 
  serverHasRole, 
  serverHasAnyRole,
  isUserAdmin,
  getServerUserRole 
} from '@/core/security/RoleCheckServer';

export default async function Dashboard() {
  const user = await getCurrentUser();

  // Single role check
  if (isUserAdmin(user)) {
    // Show admin dashboard
  }

  // Multiple role check
  if (serverHasAnyRole(user, ['admin', 'moderator'])) {
    // Show moderation panel
  }

  return <div>Dashboard</div>;
}
```

### Option C: API Routes

Protect API endpoints with role checks:

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { serverHasRole } from '@/core/security/RoleCheckServer';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!serverHasRole(user, 'admin')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  // Admin-only logic here
  return NextResponse.json({ success: true });
}
```

## 3. Middleware Protection

Protect routes at the middleware level:

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { serverHasRole } from '@/core/security/RoleCheckServer';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const user = await getCurrentUser();

    if (!serverHasRole(user, 'admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/settings/:path*'],
};
```

## 4. Common Patterns

### Pattern 1: Conditional Feature Flag

```tsx
'use client';

import { hasRole } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function Page({ currentUser }: CurrentUserProps) {
  return (
    <div>
      {hasRole(currentUser, 'admin') && <BetaFeature />}
    </div>
  );
}
```

### Pattern 2: Role-Based Rendering

```tsx
'use client';

import { getUserRole } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function Dashboard({ currentUser }: CurrentUserProps) {
  const role = getUserRole(currentUser);

  switch (role) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <UserDashboard />;
    default:
      return <GuestDashboard />;
  }
}
```

### Pattern 3: Protected Button with Hook

```tsx
'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';
import type { CurrentUserProps } from '@/types';

export default function PostCard({ currentUser }: CurrentUserProps) {
  const { requireRole } = useRoleCheck(currentUser);

  const handleDelete = async () => {
    if (!requireRole('admin', '/unauthorized')) {
      return;
    }

    // Delete logic here
  };

  return <button onClick={handleDelete}>Delete Post</button>;
}
```

### Pattern 4: Server Component with Conditional Rendering

```tsx
import { getCurrentUser } from '@/lib/auth';
import { isUserAdmin } from '@/core/security/RoleCheckServer';

export default async function AdminLink() {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    return null;
  }

  return <a href="/admin">Admin Panel</a>;
}
```

## 5. Type Definitions

### UserRole Type

```typescript
type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
```

### CurrentUserProps

```typescript
interface CurrentUserProps {
  currentUser?: {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    password: string | null;
    isAdmin: boolean;
  } | null;
}
```

## 6. Best Practices

1. **Use Server Components when possible** - Check roles on the server to prevent unauthorized data leakage
2. **Provide fallback UI** - Use the `fallback` prop instead of redirects for better UX when possible
3. **Consistent redirect targets** - Use consistent redirect destinations across your app
4. **Type safety** - Always use TypeScript types for role values
5. **Error handling** - Handle edge cases like null or undefined users
6. **Testing** - Test both authorized and unauthorized scenarios
7. **Performance** - Cache role checks when possible to avoid repeated computations

## 7. Integration with Existing Auth

Make sure to update `src/lib/auth.ts` (or your auth file) to export `getCurrentUser`:

```tsx
export async function getCurrentUser() {
  // Your existing auth logic
  return currentUser;
}
```

## 8. Extending Roles

To add more roles:

1. Update `UserRole` type in `RoleCheck.tsx`
2. Add role mapping logic in `getUserRole()` function
3. Update role-related fields in your database/Prisma schema
4. Update examples as needed

Example with additional roles:

```typescript
type UserRole = 'admin' | 'moderator' | 'user' | 'premium_user' | 'guest';

export function getUserRole(currentUser: CurrentUserProps['currentUser']): UserRole {
  if (!currentUser) return 'guest';
  if (currentUser.isAdmin) return 'admin';
  if (currentUser.isModerator) return 'moderator';
  if (currentUser.isPremium) return 'premium_user';
  return 'user';
}
```

## Summary

| Use Case | Solution |
|----------|----------|
| Wrap component | `<RoleCheck>` or `withRoleCheck()` |
| Check role in render | `useRoleCheck()` hook or utility functions |
| Server Component | `checkUserRole()` or server utilities |
| API Route | Server utilities + NextResponse |
| Middleware | Server utilities + redirect |
| Conditional UI | `hasRole()` or `hasAnyRole()` |
