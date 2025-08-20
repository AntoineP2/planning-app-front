import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

vi.mock('axios');
const mockedAxios = (axios as unknown) as { post: ReturnType<typeof vi.fn> };

describe('teamCalendar.api errors', () => {
    it("getAllUsersWithEventApi propage l'erreur mappée", async () => {
        const mod = await import('../teamCalendar.api');
        mockedAxios.post = vi.fn().mockRejectedValueOnce(new Error('boom'));
        await expect(mod.getAllUsersWithEventApi('t', [new Date()])).rejects.toThrow('Failed to fetch events');
    });
});
