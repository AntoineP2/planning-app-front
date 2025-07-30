import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { CalendarFormStateType, HourlyCaseEnum } from '../calendarForm.utils';
import { createEventsApi } from './calendarForm.api';

const useCalendarFormStore = create<CalendarFormStateType>(set => ({
    hourAmEnd: 12,
    hourAmStart: 8,
    hourPmEnd: 17,
    hourPmStart: 13,
    minuteAmEnd: 0,
    minuteAmStart: 0,
    minutePmEnd: 0,
    minutePmStart: 0,
    selectedDate: [],
    isLoading: false,
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
            hourAmEnd: 12,
            hourAmStart: 8,
            hourPmEnd: 17,
            hourPmStart: 13,
            minuteAmEnd: 0,
            minuteAmStart: 0,
            minutePmEnd: 0,
            minutePmStart: 0,
        });
    },
    createEvents: async eventsData => {
        try {
            set({ isLoading: true });
            const { date } = eventsData;
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            if (!date.length) {
                throw new Error('Les dates ne sont pas sélectionnées');
            }
            await createEventsApi(eventsData, tokenAuth);
            set({ isLoading: false });
            toast.success('Événement créé avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useCalendarFormStore };
