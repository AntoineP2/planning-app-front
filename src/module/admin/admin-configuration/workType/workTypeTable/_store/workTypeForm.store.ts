import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { formatWorkTypeList, WorkTypeStateType, WorkTypeType } from '../workTypeTable.utils';
import { createWorkTypeApi, deleteWorkTypeApi, getAllWorkTypeApi, updateWorkTypeApi } from './workTypeForm.api';

const useWorkTypeStore = create<WorkTypeStateType>(set => ({
    isLoading: false,
    selectedWorkType: {
        id: '',
        name: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        weeklyHour: '',
    },
    workTypeList: [],
    workTypeListFormated: [],
    updateWorkTypeModalFormState: false,
    deleteWorkTypeModalState: false,
    createWorkTypeModaleState: false,
    setCreateWorkTypeModaleState: state => {
        set({ createWorkTypeModaleState: state });
    },
    setDeleteWorkTypeModalState: state => {
        set({ deleteWorkTypeModalState: state });
    },
    setUpdateWorkTypeModalFormState: state => {
        set({ updateWorkTypeModalFormState: state });
    },
    setWorkTypeSelected: (workType: WorkTypeType) => {
        set({ selectedWorkType: { ...workType } });
    },
    setWorkTypeListFormated: (workTypeList: WorkTypeType[], workTypeDefault: WorkTypeType) => {
        set({
            workTypeListFormated: formatWorkTypeList(workTypeList, workTypeDefault),
        });
    },
    getWorkTypeList: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const workTypeList = await getAllWorkTypeApi(tokenAuth);
            set({ isLoading: false, workTypeList });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    getWorkTypeDefault: async () => { },
    createWorkType: async (name, weeklyHour, monday, tuesday, wednesday, thursday, friday) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await createWorkTypeApi(name, weeklyHour, monday, tuesday, wednesday, thursday, friday, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil crée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    deleteWorkType: async id => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await deleteWorkTypeApi(id, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil supprimé avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateWorkType: async workType => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateWorkTypeApi(workType, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil modifié avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useWorkTypeStore };
