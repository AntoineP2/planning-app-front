import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllUsersWithEventApi, getAllWorkTypeApi, getParkingPlaceRessourceApi } from '../teamCalendar.api';

vi.mock('axios');
const mockedAxios = (axios as unknown) as { post: ReturnType<typeof vi.fn> };

describe('teamCalendar.api', () => {
    beforeEach(() => {
        mockedAxios.post = vi.fn();
        (process as any).env.NEXT_PUBLIC_API_URL = 'http://api';
        (process as any).env.NEXT_PUBLIC_API_KEY = 'key';
    });

    it('getAllWorkTypeApi retourne la liste des work types', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { data: { getAllWorkType: [{ id: '1', name: 'Bureau' }] } } });
        const res = await getAllWorkTypeApi('t');
        expect(res[0].id).toBe('1');
    });

    it('getAllUsersWithEventApi retourne des utilisateurs', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    getAllUsersWithEvent: [
                        { id: 'u1', firstName: 'A', lastName: 'B', workTypeId: '1', EventCalendar: [] },
                    ],
                },
            },
        });
        const res = await getAllUsersWithEventApi('t', [new Date()]);
        expect(res[0].id).toBe('u1');
    });

    it('getParkingPlaceRessourceApi retourne des ressources parking', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                data: {
                    getParkingPlaceWithBooking: [
                        {
                            id: 'p1',
                            name: 'P',
                            underground: true,
                            chargingStation: false,
                            entrepriseId: '1',
                            ParkingPlaceBooking: [],
                        },
                    ],
                },
            },
        });
        const res = await getParkingPlaceRessourceApi('1', [new Date()], 't');
        expect(res[0].id).toBe('p1');
    });

    it('getParkingPlaceRessourceApi propage une erreur GraphQL', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { errors: [{ message: 'pk error' }] } });
        await expect(getParkingPlaceRessourceApi('1', [new Date()], 't')).rejects.toThrow('pk error');
    });
});
