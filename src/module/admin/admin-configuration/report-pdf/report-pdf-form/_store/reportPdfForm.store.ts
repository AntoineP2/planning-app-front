import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { ReportPdfFormStateType } from '../reportPdfForm.utils';
import { getReportPresenceDataApi } from './reportPdfForm.api';

const useReportPdfFormStore = create<ReportPdfFormStateType>(set => ({
    selectedUsersId: [],
    selectedDates: [],
    isLoading: false,
    reportPresenceData: [],
    setSelectedDates: (dates: string[]) => {
        set({ selectedDates: dates });
    },
    setSelectedUsersId: (id: string[]) => {
        set({ selectedUsersId: id });
    },
    getReportPresenceData : async (usersId, datesString) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const reportPresenceData =  await getReportPresenceDataApi(usersId, datesString, tokenAuth);
            set({ isLoading: false, reportPresenceData });
            toast.success('Le rapport a été généré');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    resetPresenceData: () => {
        set({ reportPresenceData: [] });
    }
}));

export { useReportPdfFormStore };
