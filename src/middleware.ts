import { NextResponse } from 'next/server';

export function middleware(req) {
  const isLoggedIn = true; //req.cookies.get('auth');
  if (!isLoggedIn && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}