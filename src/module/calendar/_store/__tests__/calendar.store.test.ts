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

describe('calendar.store', () => {
    beforeEach(() => {
        // reset store state between tests
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

    it('setDate met à jour la date', () => {
        const d = new Date('2024-01-01');
        useCalendarStore.getState().setDate(d);
        expect(useCalendarStore.getState().date.toISOString()).toBe(d.toISOString());
    });

    it('setEvents charge et normalise les événements', async () => {
        await useCalendarStore.getState().setEvents('u1');
        const events = useCalendarStore.getState().events;
        expect(events.length).toBeGreaterThan(0);
        expect(events[0].start instanceof Date).toBe(true);
    });

    it('deleteEvent bascule isLoading puis appelle l’API de suppression', async () => {
        const p = useCalendarStore.getState().deleteEvent('e1', 'u1');
        expect(useCalendarStore.getState().isLoading).toBe(true);
        await p;
        expect(useCalendarStore.getState().isLoading).toBe(false);
    });

    it('setters modifient les flags et date', () => {
        useCalendarStore.getState().setChoiceEventModal(true);
        // Activer delete masque choice
        useCalendarStore.getState().setDeleteEventModal(true);
        // Activer update masque delete et choice
        useCalendarStore.getState().setUpdateEventModal(true);
        // Create ne masque pas les autres
        useCalendarStore.getState().setCreateEventModal(true);
        useCalendarStore.getState().setIsError(true);
        useCalendarStore.getState().setIsLoading(true);
        useCalendarStore.getState().setEventId('id');
        useCalendarStore.getState().setDate(new Date('2024-01-01'));
        expect(useCalendarStore.getState().choiceEventModal).toBe(false);
        expect(useCalendarStore.getState().deleteEventModal).toBe(false);
        expect(useCalendarStore.getState().updateEventModal).toBe(true);
        expect(useCalendarStore.getState().createEventModal).toBe(true);
        expect(useCalendarStore.getState().eventId).toBe('id');
    });
});
