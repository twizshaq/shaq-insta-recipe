// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Check if the user is trying to access a protected route
    if (req.nextUrl.pathname.startsWith('/account')) {
        if (!session) {
            // Redirect to sign-up page if not logged in and trying to access /account
            return NextResponse.redirect(new URL('/sign-up', req.url));
        }
    }

    // For the sign-up page, redirect to /account if the user *is* logged in.
    if (req.nextUrl.pathname === '/sign-up' && session) {
        return NextResponse.redirect(new URL('/account', req.url));
    }

    return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: ['/account', '/sign-up'], // Protect *only* these routes
};