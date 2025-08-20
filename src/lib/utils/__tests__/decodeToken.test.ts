import { beforeAll, describe, expect, it, vi } from 'vitest';
import { decodeToken, isConnectedVerify } from '../decodeToken';

// On mock la clé publique pour que jose puisse vérifier un JWT signé avec la même clé.
// Pour des tests ultra simples, on contourne en mockant jwtVerify directement.
vi.mock('jose', () => {
    return {
        jwtVerify: async (token: string) => {
            if (token === 'valid-token') {
                return { payload: { sub: '123', email: 'test@example.com' } };
            }
            throw new Error('invalid');
        },
    };
});

describe('decodeToken utils', () => {
    beforeAll(() => {
        // Simule une clé publique présente
        (process as any).env.NEXT_PUBLIC_JWT_PUBLIC_KEY = 'dummy';
    });

    it('decodeToken retourne payload pour un token valide', async () => {
        const payload = await decodeToken('valid-token');
        expect(payload).toMatchObject({ sub: '123' });
    });

    it('decodeToken retourne undefined pour un token invalide', async () => {
        const payload = await decodeToken('invalid-token');
        expect(payload).toBeUndefined();
    });

    it('isConnectedVerify retourne true/false selon validité', async () => {
        await expect(isConnectedVerify('valid-token')).resolves.toBe(true);
        await expect(isConnectedVerify('invalid-token')).resolves.toBe(false);
    });
});
