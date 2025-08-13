import { jwtVerify } from 'jose';

const JWT_PUBLIC_KEY: string = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY as string;

const secret = new TextEncoder().encode(JWT_PUBLIC_KEY);

export async function decodeToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        console.log(payload);
        return payload;
    } catch (error) {
        return;
    }
}

export async function isConnectedVerify(token: string) {
    try {
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        return false;
    }
}
