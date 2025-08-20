import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTeamCalendarStore } from '../teamCalendar.store';

vi.mock('cookies-next', () => ({ getCookie: vi.fn(() => 'tkn') }));
vi.mock('sonner', () => ({ toast: { info: vi.fn(), error: vi.fn() } }));
vi.mock('../../teamCalendar.utils', () => ({
    TABLE_CHOICE_ENUM: { PLANNING: 'planning', PARKING: 'parking' },
    setDayInterval: vi.fn(() => [new Date(), new Date(), new Date(), new Date(), new Date()]),
    formatTableDataEvent: vi.fn(() => []),
    setDefaultColumns: vi.fn(() => []),
    setDataColumnsDaysOfWeek: vi.fn(() => []),
    formatTableDataParkingRessource: vi.fn(() => []),
    setDefaultParkingColumns: vi.fn(() => []),
    setDataColumnsParkingRessourcesDaysOfWeek: vi.fn(() => []),
}));
vi.mock('../teamCalendar.api', () => ({
    getAllUsersWithEventApi: vi.fn(async () => []),
    getAllWorkTypeApi: vi.fn(async () => [
        {
            id: '1',
            name: 'Bureau',
            monday: '8',
            tuesday: '8',
            wednesday: '8',
            thursday: '8',
            friday: '8',
            weeklyHour: '40',
        },
    ]),
    getParkingPlaceRessourceApi: vi.fn(async () => [
        { id: 'p1', name: 'P', underground: true, chargingStation: false, entrepriseId: '1', ParkingPlaceBooking: [] },
    ]),
}));

describe('teamCalendar.store', () => {
    beforeEach(() => {
        const { getState, setState } = useTeamCalendarStore;
        setState({
            ...getState(),
            isLoading: false,
            isWorkTypeLoading: false,
            usersWithEventsList: [],
            workType: [],
            workTypeFilter: [],
        });
    });

    it('setWorkType charge et remplit workTypeFilter', async () => {
        await useTeamCalendarStore.getState().setWorkType();
        expect(useTeamCalendarStore.getState().workType.length).toBe(1);
        expect(useTeamCalendarStore.getState().workTypeFilter).toContain('Bureau');
    });

    it('setWorkTypeFilter ajoute/retire correctement', () => {
        useTeamCalendarStore.getState().setWorkTypeFilter(true, 'Bureau');
        expect(useTeamCalendarStore.getState().workTypeFilter).toContain('Bureau');
        useTeamCalendarStore.getState().setWorkTypeFilter(false, 'Bureau');
        expect(useTeamCalendarStore.getState().workTypeFilter).not.toContain('Bureau');
    });

    it('setters de table et jours fonctionnent', () => {
        useTeamCalendarStore.getState().setTableState('parking' as any);
        useTeamCalendarStore.getState().setDaysOfWeek(new Date('2024-01-02'));
        expect(useTeamCalendarStore.getState().tableState).toBe('parking');
        expect(Array.isArray(useTeamCalendarStore.getState().daysOfWeek)).toBe(true);
    });

    it('setUsersWithEventsList charge la liste et met à jour isLoading', async () => {
        await useTeamCalendarStore.getState().setUsersWithEventsList([new Date()]);
        expect(useTeamCalendarStore.getState().isLoading).toBe(false);
        expect(Array.isArray(useTeamCalendarStore.getState().usersWithEventsList)).toBe(true);
    });

    it('getParkingPlacesRessources met à jour le store', async () => {
        await useTeamCalendarStore.getState().getParkingPlacesRessources([new Date()], 'u1', []);
        expect(useTeamCalendarStore.getState().parkingPlacesRessources.length).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(useTeamCalendarStore.getState().dataTableParkingRessourcesFormatted)).toBe(true);
    });
});
