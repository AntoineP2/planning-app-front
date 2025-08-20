import { describe, expect, it, vi } from 'vitest';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('~/lib/utils/decodeToken', () => ({ decodeToken: vi.fn(async () => undefined) }));
vi.mock('../authentication.api', () => ({
    getUserApi: vi.fn(async () => 'tok'),
    registerUserApi: vi.fn(async () => ({ id: '1' })),
    loginSSOGoogleApi: vi.fn(async () => {
        throw new Error('fail');
    }),
    loginSSOMicrosoftApi: vi.fn(async () => {
        throw new Error('fail');
    }),
}));

describe('authentication.store (erreurs)', () => {
    it('getUser gère le token invalide (decodeToken undefined)', async () => {
        // Importer après les mocks
        const { useAuthenticationStore } = await import('../authentication.store');
        await useAuthenticationStore.getState().getUser('a@b.c', 'p');
        expect(useAuthenticationStore.getState().userId).toBe('');
    });

    it('loginSSOGoogle et loginSSOMicrosoft propagent erreur et déclenchent le catch', async () => {
        const { useAuthenticationStore } = await import('../authentication.store');
        await expect(useAuthenticationStore.getState().loginSSOGoogle()).resolves.toBeUndefined();
        await expect(useAuthenticationStore.getState().loginSSOMicrosoft()).resolves.toBeUndefined();
    });
});
