import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCalendarStore } from '../calendar.store';

vi.mock('cookies-next', () => ({ getCookie: vi.fn(() => 'tkn') }));
vi.mock('sonner', () => ({ toast: { info: vi.fn(), error: vi.fn() } }));
vi.mock('../calendar.api', () => ({
    getEventsByUserId: vi.fn(async () => [{ id: '1', start: new Date().toISOString(), end: new Date().toISOString() }]),
    getWorkTypeByUserIdApi: vi.fn(async () => ({
        id: '1',
        name: 'Bureau',
        monday: '8',
        tuesday: '8',
        wednesday: '8',
        thursday: '8',
        friday: '8',
        weeklyHour: '40',
    })),
    deleteEventApi: vi.fn(async () => undefined),
}));

describe('admin user-configuration calendar.store', () => {
    beforeEach(() => {
        const { getState, setState } = useCalendarStore;
        setState({
            ...getState(),
            events: [],
            isLoading: false,
            isError: false,
            eventId: '',
            deleteEventModal: false,
            updateEventModal: false,
            choiceEventModal: false,
            createEventModal: false,
        });
    });

    it('setEvents charge des événements', async () => {
        await useCalendarStore.getState().setEvents('u1');
        expect(useCalendarStore.getState().events.length).toBeGreaterThan(0);
    });

    it('setters modifient correctement les flags', () => {
        useCalendarStore.getState().setChoiceEventModal(true);
        expect(useCalendarStore.getState().choiceEventModal).toBe(true);
        useCalendarStore.getState().setDeleteEventModal(true);
        expect(useCalendarStore.getState().deleteEventModal).toBe(true);
        useCalendarStore.getState().setUpdateEventModal(true);
        expect(useCalendarStore.getState().updateEventModal).toBe(true);
        useCalendarStore.getState().setCreateEventModal(true);
        expect(useCalendarStore.getState().createEventModal).toBe(true);
        useCalendarStore.getState().setIsError(true);
        expect(useCalendarStore.getState().isError).toBe(true);
        useCalendarStore.getState().setIsLoading(true);
        expect(useCalendarStore.getState().isLoading).toBe(true);
        useCalendarStore.getState().setEventId('abc');
        expect(useCalendarStore.getState().eventId).toBe('abc');
        useCalendarStore.getState().setDate(new Date('2024-01-01'));
    });
});
