import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthenticationStore } from '../authentication.store';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('~/lib/utils/decodeToken', () => ({
    decodeToken: vi.fn(async () => ({
        firstName: 'A',
        lastName: 'B',
        trigramme: 'AB',
        email: 'a@b.c',
        id: '1',
        role: ['USER'],
    })),
}));
vi.mock('../authentication.api', () => ({
    getUserApi: vi.fn(async () => 'tok'),
    registerUserApi: vi.fn(async () => ({ id: '1' })),
    loginSSOGoogleApi: vi.fn(async () => undefined),
    loginSSOMicrosoftApi: vi.fn(async () => undefined),
}));

describe('authentication.store', () => {
    beforeEach(() => {
        const { getState, setState } = useAuthenticationStore;
        setState({
            ...getState(),
            userFirstName: '',
            userLastName: '',
            userTrigramme: '',
            userMail: '',
            userId: '',
            userRole: [],
            loading: false,
            loadingRegister: false,
        });
    });

    it('getUser remplit les champs utilisateur', async () => {
        await useAuthenticationStore.getState().getUser('a@b.c', 'p');
        expect(useAuthenticationStore.getState().userFirstName).toBe('A');
        expect(useAuthenticationStore.getState().userRole).toContain('USER');
    });

    it('registerUser bascule loadingRegister', async () => {
        const p = useAuthenticationStore
            .getState()
            .registerUser({ firstName: 'A', lastName: 'B', trigramme: 'AB', email: 'a@b.c', password: 'x' } as any);
        expect(useAuthenticationStore.getState().loadingRegister).toBe(true);
        await p;
        expect(useAuthenticationStore.getState().loadingRegister).toBe(false);
    });

    it('setUserData et resetUserData fonctionnent', () => {
        useAuthenticationStore
            .getState()
            .setUserData({
                userFirstName: 'A',
                userLastName: 'B',
                userTrigramme: 'AB',
                userEmail: 'a@b.c',
                userId: '1',
                userRole: ['USER'],
            });
        expect(useAuthenticationStore.getState().userId).toBe('1');
        useAuthenticationStore.getState().resetUserData();
        expect(useAuthenticationStore.getState().userId).toBe('');
    });
});
