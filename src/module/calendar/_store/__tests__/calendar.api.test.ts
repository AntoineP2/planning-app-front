import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteEventApi, getEventsByUserId, getWorkTypeByUserIdApi } from '../calendar.api';

vi.mock('axios');

const mockedAxios = (axios as unknown) as { post: ReturnType<typeof vi.fn> };

describe('calendar.api', () => {
    beforeEach(() => {
        mockedAxios.post = vi.fn();
        (process as any).env.NEXT_PUBLIC_API_URL = 'http://api';
        (process as any).env.NEXT_PUBLIC_API_KEY = 'key';
    });

    it('getEventsByUserId retourne la liste depuis la réponse GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { eventsByUserIdAndDate: [{ id: '1', start: '2024-01-01', end: '2024-01-01' }] } },
        });
        const events = await getEventsByUserId('u1', new Date().toISOString(), 'token');
        expect(Array.isArray(events)).toBe(true);
        expect(events[0].id).toBe('1');
    });

    it('deleteEventApi ne lève pas si pas derreurs GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: {}, errors: undefined } });
        await expect(deleteEventApi('e1', 'u1', 't')).resolves.toBeUndefined();
    });

    it('getWorkTypeByUserIdApi retourne le type de travail', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    getWorkTypeByUserId: {
                        id: '1',
                        name: 'Bureau',
                        monday: '8',
                        tuesday: '8',
                        wednesday: '8',
                        thursday: '8',
                        friday: '8',
                        weeklyHour: '40',
                    },
                },
            },
        });
        const workType = await getWorkTypeByUserIdApi('u1', 't');
        expect(workType.name).toBe('Bureau');
    });

    it('deleteEventApi propage une erreur GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: {}, errors: [{ message: 'bad' }] } });
        await expect(deleteEventApi('e1', 'u1', 't')).rejects.toThrow('bad');
    });

    it('getWorkTypeByUserIdApi propage une erreur GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { errors: [{ message: 'wt error' }] } });
        await expect(getWorkTypeByUserIdApi('u1', 't')).rejects.toThrow('wt error');
    });
});
