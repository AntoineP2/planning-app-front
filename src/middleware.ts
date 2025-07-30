// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { decodeToken, isConnectedVerify } from './lib/utils/decodeToken';

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isLoggedIn = async (): Promise<boolean> => {
        if (!request.cookies.get('tokenAuth')) return false;
        const cookieValue: string = request.cookies.get('tokenAuth')?.value as string;
        return await isConnectedVerify(cookieValue);
    };

    const isAdmin = async (): Promise<boolean> => {
        if (!request.cookies.get('tokenAuth')) return false;
        const cookieValue: string = request.cookies.get('tokenAuth')?.value as string;
        const data: any = await decodeToken(cookieValue);
        if (!data) return false;
        return data.userRole.includes('admin');
    }

    // Rediriger l'utilisateur s'il n'est pas connecté et tente d'accéder à une page protégée
    if (!(await isLoggedIn()) && pathname.startsWith('/espace-utilisateur')) {
        const url = request.nextUrl.clone();
        url.pathname = '/connexion';
        return NextResponse.redirect(url);
    }

    if ((await isLoggedIn()) && pathname.startsWith('/connexion')) {
        const url = request.nextUrl.clone();
        url.pathname = '/espace-utilisateur';
        return NextResponse.redirect(url);   
    }

    if (!(await isAdmin()) && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/espace-utilisateur';
        return NextResponse.redirect(url);
    }

    if (pathname.valueOf() === '/') {
        const url = request.nextUrl.clone();
        (await isLoggedIn()) ? (url.pathname = '/espace-utilisateur') : (url.pathname = '/connexion');
        return NextResponse.redirect(url);
    }



    return NextResponse.next();
}

export const config = {
    matcher: ['/espace-utilisateur/:path*', '/connexion/:path*', '/', '/admin/:path*'],
};
