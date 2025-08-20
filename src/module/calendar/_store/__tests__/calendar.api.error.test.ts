import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

vi.mock('axios');
const mockedAxios = (axios as unknown) as { post: ReturnType<typeof vi.fn> };

describe('calendar.api errors', () => {
    it("getEventsByUserId propage l'erreur mappée", async () => {
        const mod = await import('../calendar.api');
        mockedAxios.post = vi.fn().mockRejectedValueOnce(new Error('boom'));
        await expect(mod.getEventsByUserId('u1', new Date().toISOString(), 't')).rejects.toThrow(
            'Failed to fetch events'
        );
    });
});
