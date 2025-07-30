import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { LocationWorkEnum } from '../../calendar.utils';
import { HourlyCaseEnum } from '../../calendarForm/calendarForm.utils';
import { CalendarUpdateFormStateType, formatHourMinute } from '../calendarUpdateForm.utils';
import { getParkingPlacesCountByDateApi, updateEventApi } from './calendarUpdateForm.api';

const useCalendarUpdateFormStore = create<CalendarUpdateFormStateType>(set => ({
    hourAmEnd: 13,
    hourAmStart: 8,
    hourPmEnd: 17,
    hourPmStart: 13,
    minuteAmEnd: 0,
    minuteAmStart: 0,
    minutePmEnd: 0,
    minutePmStart: 0,
    parkingPlacesTaken: 0,
    selectedDate: [],
    isLoading: false,
    isLoadingParking: false,
    event: {
        id: '',
        titleAm: LocationWorkEnum.HOME,
        titlePm: LocationWorkEnum.HOME,
        start: new Date(),
        end: new Date(),
        parking: false,
        workTime: '',
        hourlyAm: '',
        hourlyPm: '',
    },
    setEvent: event => {
        set({ event });
    },
    setIsLoading: value => {
        set({ isLoading: value });
    },
    setSelectedDate: date => {
        set({ selectedDate: date });
    },
    setSelectedTimeValue: (event, hourlyCase) => {
        switch (hourlyCase) {
            case HourlyCaseEnum.HAMS:
                set({ hourAmStart: +event.target.value });
                break;
            case HourlyCaseEnum.MAMS:
                set({ minuteAmStart: +event.target.value });
                break;
            case HourlyCaseEnum.HAME:
                set({ hourAmEnd: +event.target.value });
                break;
            case HourlyCaseEnum.MAME:
                set({ minuteAmEnd: +event.target.value });
                break;
            case HourlyCaseEnum.HPMS:
                set({ hourPmStart: +event.target.value });
                break;
            case HourlyCaseEnum.MPMS:
                set({ minutePmStart: +event.target.value });
                break;
            case HourlyCaseEnum.HPME:
                set({ hourPmEnd: +event.target.value });
                break;
            case HourlyCaseEnum.MPME:
                set({ minutePmEnd: +event.target.value });
                break;
            default:
                break;
        }
    },
    resetData: () => {
        set({
            hourAmEnd: 13,
            hourAmStart: 8,
            hourPmEnd: 17,
            hourPmStart: 13,
            minuteAmEnd: 0,
            minuteAmStart: 0,
            minutePmEnd: 0,
            minutePmStart: 0,
        });
    },
    updateEvent: async eventsData => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateEventApi(eventsData, tokenAuth);
            set({ isLoading: false });
            toast.success('Cet événement a été modifié avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setDataEvent: event => {
        if (event.hourlyAm) {
            set({
                hourAmStart: +formatHourMinute(event.hourlyAm)[0],
                minuteAmStart: +formatHourMinute(event.hourlyAm)[1],
                hourAmEnd: +formatHourMinute(event.hourlyAm)[2],
                minuteAmEnd: +formatHourMinute(event.hourlyAm)[3],
                hourPmStart: +formatHourMinute(event.hourlyPm)[0],
                minutePmStart: +formatHourMinute(event.hourlyPm)[1],
                hourPmEnd: +formatHourMinute(event.hourlyPm)[2],
                minutePmEnd: +formatHourMinute(event.hourlyPm)[3],
            });
        }
    },
    setParkingPlacesCountByDate: async date => {
        try {
            set({ isLoadingParking: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const count = await getParkingPlacesCountByDateApi(date, tokenAuth);
            set({ isLoadingParking: false, parkingPlacesTaken: count });
            return count;
        } catch (error) {
            console.error('Error fetching parking places:', error);
            throw new Error('Failed to fetch parking places');
        }
    },
}));

export { useCalendarUpdateFormStore };
