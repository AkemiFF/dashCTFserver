import { NextResponse } from 'next/server';

export function middleware(req) {

    const url = req.nextUrl.clone();

    if (url.pathname === '/') {
        return NextResponse.redirect(new URL('/users', req.url));
    }

    const response = NextResponse.next()

    return response;
}

export const config = {
    matcher: ['/:path*'],
};
