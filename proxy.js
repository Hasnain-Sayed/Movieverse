import { NextResponse } from "next/server";

export function proxy(request) {
    const pathname = request.nextUrl.pathname
    console.log("Proxy pathname: ", pathname)

    const publicRoutes = [
        "/api/auth/signup",
        "/api/auth/login",
        "/api/auth/checkCookies",
        "/api/auth/forgot-password",
        "/api/auth/verify-otp",
        "/api/auth/reset-password",
        "/login",
        "/signup",
        "/forgot-password",
        "/",
        "/details",
        "/movies",
        "/tv",
        "/api/country",
    ]
    const isPublic = pathname === "/" || publicRoutes.some((r) => r !== "/" && pathname.startsWith(r))
    const hasToken = request.cookies.get("accessToken") || request.cookies.get("refreshToken")

    if (!isPublic && !hasToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}