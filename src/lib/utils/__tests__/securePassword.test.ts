import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import { encodePassword } from '../securePassword';

describe('securePassword', () => {
    it('encodePassword retourne un hash bcrypt vérifiable', async () => {
        const hash = await encodePassword('monSuperMotDePasse');
        const isValid = await bcrypt.compare('monSuperMotDePasse', hash);
        expect(isValid).toBe(true);
    });
});
