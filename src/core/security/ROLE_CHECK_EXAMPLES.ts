/**
 * USAGE EXAMPLES - Role Check Functionality
 * 
 * This file demonstrates various ways to use the role check functionality
 * in your Next.js 16 application.
 */

// ============================================================================
// EXAMPLE 1: Using RoleCheck Component (Client Component)
// ============================================================================

/*
'use client';

import { RoleCheck } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function AdminContent({ currentUser }: CurrentUserProps) {
  return (
    <RoleCheck 
      allowedRoles={['admin']} 
      currentUser={currentUser}
      redirectTo="/dashboard"
    >
      <div className="p-8">
        <h1>Admin Panel</h1>
        <p>Only admins can see this content</p>
      </div>
    </RoleCheck>
  );
}
*/

// ============================================================================
// EXAMPLE 2: Using withRoleCheck HOC (Client Component)
// ============================================================================

/*
import { withRoleCheck } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

function AdminDashboard() {
  return (
    <div className="p-8">
      <h1>Admin Dashboard</h1>
      <p>Admin only content</p>
    </div>
  );
}

export default withRoleCheck(
  AdminDashboard,
  ['admin'],
  '/dashboard'
);
*/

// ============================================================================
// EXAMPLE 3: Using useRoleCheck Hook (Client Component)
// ============================================================================

/*
'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';
import type { CurrentUserProps } from '@/types';

export default function SettingsPage({ currentUser }: CurrentUserProps) {
  const { isAdmin, checkRole, requireRole } = useRoleCheck(currentUser);

  const handleAdminAction = () => {
    if (requireRole('admin', '/unauthorized')) {
      console.log('Admin action performed');
    }
  };

  return (
    <div className="p-8">
      <h1>Settings</h1>
      
      {isAdmin && (
        <button onClick={handleAdminAction}>
          Admin Action
        </button>
      )}

      {checkRole('admin') && (
        <section>
          <h2>Advanced Settings</h2>
          <p>Only visible to admins</p>
        </section>
      )}
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 4: Using hasRole / hasAnyRole utility functions (Client Component)
// ============================================================================

/*
'use client';

import { hasRole, hasAnyRole } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function ContentPage({ currentUser }: CurrentUserProps) {
  const canEdit = hasRole(currentUser, 'admin');
  const canView = hasAnyRole(currentUser, ['admin', 'user']);

  return (
    <div className="p-8">
      {canView && <div>Visible to admin and users</div>}
      {canEdit && <button>Edit</button>}
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 5: Using checkUserRole in Server Component
// ============================================================================

/*
import { checkUserRole } from '@/core/security/RoleCheckServer';

export default async function AdminPage() {
  // This will redirect to /dashboard if user is not admin
  const user = await checkUserRole(['admin']);

  return (
    <div className="p-8">
      <h1>Admin Page</h1>
      <p>Welcome {user.name}</p>
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 6: Using serverHasRole / serverHasAnyRole in Server Component
// ============================================================================

/*
import { getCurrentUser } from '@/lib/auth';
import { serverHasRole, serverHasAnyRole } from '@/core/security/RoleCheckServer';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const isAdmin = serverHasRole(user, 'admin');
  const canAccess = serverHasAnyRole(user, ['admin', 'user']);

  if (!canAccess) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      {isAdmin && <AdminPanel />}
      <UserDashboard />
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 7: Using RoleCheck with fallback (Client Component)
// ============================================================================

/*
'use client';

import { RoleCheck } from '@/core/security/RoleCheck';
import type { CurrentUserProps } from '@/types';

export default function ProtectedContent({ currentUser }: CurrentUserProps) {
  return (
    <RoleCheck
      allowedRoles={['admin']}
      currentUser={currentUser}
      fallback={
        <div className="p-8 text-center">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this content</p>
        </div>
      }
    >
      <div className="p-8">
        <h1>Admin Only Content</h1>
      </div>
    </RoleCheck>
  );
}
*/

// ============================================================================
// EXAMPLE 8: Role Check in API Routes
// ============================================================================

/*
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isUserAdmin } from '@/core/security/RoleCheckServer';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!isUserAdmin(user)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    );
  }

  // Admin only logic here
  return NextResponse.json({ success: true });
}
*/

// ============================================================================
// EXAMPLE 9: Role Check in Middleware
// ============================================================================

/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { serverHasRole } from '@/core/security/RoleCheckServer';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const user = await getCurrentUser();

    if (!serverHasRole(user, 'admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
*/

// ============================================================================
// EXAMPLE 10: Multiple role checks with useRoleCheck Hook
// ============================================================================

/*
'use client';

import { useRoleCheck } from '@/hooks/useRoleCheck';
import type { CurrentUserProps } from '@/types';

export default function Dashboard({ currentUser }: CurrentUserProps) {
  const { 
    isAdmin, 
    isUser, 
    checkAnyRole, 
    requireAnyRole,
    userRole 
  } = useRoleCheck(currentUser);

  const canModerate = checkAnyRole(['admin', 'moderator']);

  const handleRestrictedAction = () => {
    if (requireAnyRole(['admin', 'user'], '/unauthorized')) {
      console.log('Action performed by admin or user');
    }
  };

  return (
    <div>
      <p>Your role: {userRole}</p>

      {isAdmin && (
        <section>
          <h2>Admin Dashboard</h2>
        </section>
      )}

      {isUser && (
        <section>
          <h2>User Dashboard</h2>
        </section>
      )}

      {canModerate && (
        <button onClick={handleRestrictedAction}>
          Moderate Content
        </button>
      )}
    </div>
  );
}
*/

export default {};
