import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getSession } from 'next-auth/react';
import { withAuth } from "next-auth/middleware"
import { IncomingHttpHeaders } from 'http';

interface CustomIncomingMessage {
    headers: IncomingHttpHeaders;
    body?: any;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (pathname == "/") {
        const url = req.nextUrl.clone()
        url.pathname="/Home"
        return NextResponse.redirect(url)
    }
    if (pathname == "/api/auth/User/login") {
        const url = req.nextUrl.clone()
        url.pathname="/User/login"
        return NextResponse.redirect(url)
    }
    // if pathname = "/auth" - redirect to /User/login, if not logged in - redirect to /User/[userid] if logged in
    const headersObject: { [key: string]: string } = Object.fromEntries(req.headers.entries());

    const customRequest: CustomIncomingMessage = { headers: headersObject, body: req.body };

    const session = await getSession({ req: customRequest });

    if (pathname == "/auth") {
        if (!session) {
            const url = req.nextUrl.clone()
            url.pathname="/User/login"
            return NextResponse.redirect(url)
        } else {
            const url = req.nextUrl.clone()
            url.pathname=`/User/profile/${session.user?.name}`
            return NextResponse.redirect(url)
        }
    }

    if (pathname == "/User/login") {
        if (session) {
            const url = req.nextUrl.clone()
            url.pathname=`/User/profile/${session.user?.name}`
            return NextResponse.redirect(url)
        }
    }
    if (pathname.includes("/User/profile/"))
    {
        if (!session) {
            const url = req.nextUrl.clone()
            url.pathname="/User/login"
            return NextResponse.redirect(url)
        }
    }
}