import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/organization(.*)',
  '/select-org',
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId, orgId, redirectToSignIn } = auth();

  if (userId && !isProtectedRoute(req)) {
    let path = '/select-org';
    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !orgId && req.nextUrl.pathname !== '/select-org') {
    const orgSelection = new URL('/select-org', req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
