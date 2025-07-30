import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { CalendarStateType, CustomEvent } from '../calendar.utils';
import { deleteEventApi, getEventsByUserId, getWorkTypeByUserIdApi } from './calendar.api';

const useCalendarStore = create<CalendarStateType>(set => ({
    events: [],
    isLoading: false,
    isError: false,
    eventId: '',
    date: new Date(),
    deleteEventModal: false,
    updateEventModal: false,
    choiceEventModal: false,
    createEventModal: false,
    setDate: (date: Date) => {
        set({ date });
    },
    setChoiceEventModal: (choiceEventModal: boolean) => {
        set({ choiceEventModal });
        set({ updateEventModal: false });
        set({ deleteEventModal: false });
    },
    setDeleteEventModal: (deleteEventModal: boolean) => {
        set({ deleteEventModal });
        set({ updateEventModal: false });
        set({ choiceEventModal: false });
    },
    setUpdateEventModal: (updateEventModal: boolean) => {
        set({ updateEventModal });
        set({ deleteEventModal: false });
        set({ choiceEventModal: false });
    },
    setCreateEventModal: (createEventModal: boolean) => {
        set({ createEventModal });
    },
    setEventId: (eventId: string) => {
        set({ eventId });
    },
    setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
    },
    setIsError: (isError: boolean) => {
        set({ isError });
    },
    setEvents: async (userId: string, date?: Date) => {
        try {
            set({ isLoading: true, isError: false });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }

            const dateFormatted = date ? date.toISOString() : new Date().toISOString();

            const workType = await getWorkTypeByUserIdApi(userId, tokenAuth);

            const events: CustomEvent[] = await getEventsByUserId(userId, dateFormatted, tokenAuth);

            events.map(event => {
                event.start = new Date(event.start);
                event.end = new Date(event.end);
                event.workType = workType;
                return event;
            });
            set({ events, isLoading: false });
        } catch (e) {
            set({ isLoading: false, isError: true });
        }
    },
    deleteEvent: async (eventId: string, userId: string) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await deleteEventApi(eventId, userId, tokenAuth);
            set({ isLoading: false });
            toast.info('Événement supprimé avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useCalendarStore };
