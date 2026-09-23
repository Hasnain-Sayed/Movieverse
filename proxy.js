import { NextResponse } from "next/server";

export function proxy(request) {
    const pathname = request.nextUrl.pathname
    console.log("Proxy pathname: ", pathname)

    const publicRoutes = [
        "/api/auth/register",
        "/api/auth/login",
        "/api/auth/checkCookies",
        "/api/auth/forgot-password",
        "/api/auth/verify-otp",
        "/api/auth/reset-password",
        "/login",
        "/signup",
        "/forgot-password",
        "/"
    ]
    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));

    if (!isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}