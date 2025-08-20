import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUserApi, loginSSOGoogleApi, loginSSOMicrosoftApi, registerUserApi } from '../authentication.api';
vi.mock('~/lib/utils/securePassword', () => ({ encodePassword: vi.fn(async (p: string) => `hashed:${p}`) }));

vi.mock('axios');
const mockedAxios = (axios as unknown) as { post: ReturnType<typeof vi.fn> };

describe('authentication.api', () => {
    beforeEach(() => {
        mockedAxios.post = vi.fn();
        (process as any).env.NEXT_PUBLIC_API_URL = 'http://api';
        (process as any).env.NEXT_PUBLIC_API_KEY = 'key';
        (process as any).env.NEXT_PUBLIC_API_URL_SSO = 'http://sso';
    });

    it('getUserApi retourne le token/valeur GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: { userExists: 'token123' } } });
        const res = await getUserApi('a@b.c', 'p');
        expect(res).toBe('token123');
    });

    it('getUserApi propage une erreur en cas de rejet axios', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('nope'));
        await expect(getUserApi('x@y.z', 'p')).rejects.toThrow('nope');
    });

    it('registerUserApi envoie les données et retourne createUser', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: { createUser: { id: '1' } } } });
        const res = await registerUserApi({
            firstName: 'A',
            lastName: 'B',
            trigramme: 'ab',
            email: 'a@b.c',
            password: 'x',
        } as any);
        expect(res.id).toBe('1');
    });

    it('registerUserApi propage l’erreur axios', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('bad'));
        await expect(
            registerUserApi({ firstName: 'A', lastName: 'B', trigramme: 'ab', email: 'a@b.c', password: 'x' } as any)
        ).rejects.toThrow('bad');
    });

    it('loginSSOGoogleApi redirige vers le SSO Google', async () => {
        (global as any).window = { location: { href: '' } };
        await loginSSOGoogleApi();
        expect((global as any).window.location.href).toContain('/auth/google/login');
    });

    it('loginSSOMicrosoftApi redirige vers le SSO Microsoft', async () => {
        (global as any).window = { location: { href: '' } };
        await loginSSOMicrosoftApi();
        expect((global as any).window.location.href).toContain('/auth/microsoft/login');
    });

    it('loginSSOGoogleApi rejette si window absent (branche catch)', async () => {
        // @ts-ignore
        delete (global as any).window;
        await expect(loginSSOGoogleApi()).rejects.toBeTruthy();
    });

    it('loginSSOMicrosoftApi rejette si window absent (branche catch)', async () => {
        // @ts-ignore
        delete (global as any).window;
        await expect(loginSSOMicrosoftApi()).rejects.toBeTruthy();
    });
});
