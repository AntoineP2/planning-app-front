import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { CalendarFormStateType, HourlyCaseEnum } from '../calendarForm.utils';
import { createEventsApi, getEventsExisteApi } from './calendarForm.api';
import { formatHourMinute } from '../../calendarUpdateForm/calendarUpdateForm.utils';

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
    validateChoicesModal: false,
    validateChoices: false,
    isLoadingEventsExiste: false,
    setValidateChoices: value => {
        set({ validateChoices: value });
    },
    setValidateChoicesModal: value => {
        set({ validateChoicesModal: value });
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
            const { date, userId } = eventsData;
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            if (!date.length) {
                throw new Error('Les dates ne sont pas sélectionnées');
            }
            const eventsExiste = await getEventsExisteApi(userId, date, tokenAuth);
            if(eventsExiste.length > 0) {
                set({ isLoading: false });
                return false;
            }
            await createEventsApi(eventsData, tokenAuth);
            set({ isLoading: false });
            toast.success('Événement créé avec succès.');
            return true;
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                error.message.split('-').map((message: string) => {
                    toast.error(message);
                });
            }
        }
    },
    createAndUpdateEvents: async eventsData => {
        try {
            set({ isLoading: true });
            const { date, userId } = eventsData;
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            if (!date.length) {
                throw new Error('Les dates ne sont pas sélectionnées');
            }
            await createEventsApi(eventsData, tokenAuth);
            set({ isLoading: false });
            toast.success('Événement(s) modifié(s) ou créé(s) avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                error.message.split('-').map((message: string) => {
                    toast.error(message);
                });
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
}));

export { useCalendarFormStore };
