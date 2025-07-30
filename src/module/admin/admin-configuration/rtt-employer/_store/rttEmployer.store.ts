import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { RttEmployerStateType } from '../rttEmployer.utils';
import { setRttEmployerEventApi } from './rttEmployer.api';

const useRttEmployerStore = create<RttEmployerStateType>(set => ({
    isLoading: false,
    selectedDate: [],
    selectedUserId: [],
    setSelectedDate: date => {
        set({ selectedDate: date });
    },
    setSelectedUserId: userId => {
        set({ selectedUserId: userId });
    },
    setRttEmployerEvent: async (selectedUserId: string[], selectedDate: string[]) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            if (!selectedDate.length) {
                throw new Error('Les dates ne sont pas sélectionnées');
            }
            const titleAm = 'RTT Employeur';
            await setRttEmployerEventApi(selectedUserId, selectedDate, titleAm, tokenAuth);
            set({ isLoading: false });
            toast.success('Les RTT ont été appliqués avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useRttEmployerStore };
