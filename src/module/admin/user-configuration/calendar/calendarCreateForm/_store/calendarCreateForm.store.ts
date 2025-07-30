import { create } from 'zustand';
import { CalendarModaleCreateFormStateType } from '../calendarCreateForm.utils';

const useCalendarModaleCreateForm = create<CalendarModaleCreateFormStateType>(set => ({
    newEventDate: new Date(),
    setNewEventDate: date => {
        set({ newEventDate: date });
    },
}));

export { useCalendarModaleCreateForm };
