import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { countParkingPlacesByCompanyIdApi, createEntrepriseApi, deleteEntrepriseApi, getAllEntreprisesApi, updateEntrepriseApi } from './company.api';
import { CompanyStoreStateType, formatCompanyList } from '../company.utils';

const useCompanyStore = create<CompanyStoreStateType>(set => ({
    isLoading: false,
    companyList: [],
    companyTableList: [],
    companySelected: {
        id: '',
        name: '',
        description: '',
        officeNumber: '',
    },

    isModalCreateVisible: false,
    isModalUpdateVisible: false,
    isModalDeleteVisible: false,
    parkingPlacesCount: [{
        companyId: '',
        total: 0,
        underground: 0,
        notUnderground: 0,
    }],

    setIsModalCreateVisible: value => set({ isModalCreateVisible: value }),
    setIsModalUpdateVisible: value => set({ isModalUpdateVisible: value }),
    setIsModalDeleteVisible: value => set({ isModalDeleteVisible: value }),

    setCompanySelected: value => set({ companySelected: value }),

    getParkingPlacesCount: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const parkingPlacesCount = await countParkingPlacesByCompanyIdApi(tokenAuth);
            set({ isLoading: false, parkingPlacesCount });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    getAllCompany: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const companyList = await getAllEntreprisesApi(tokenAuth);
            set({ isLoading: false, companyList, companyTableList: formatCompanyList(companyList) });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    createCompany: async (name, description, officeNumber) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await createEntrepriseApi(name, description, officeNumber, tokenAuth);
            set({ isLoading: false, isModalCreateVisible: false });
            toast.success('Entreprise créée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    deleteCompany: async id => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await deleteEntrepriseApi(id, tokenAuth);
            set({ isLoading: false });
            toast.success('Entreprise supprimée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateCompany: async entreprise => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateEntrepriseApi(entreprise, tokenAuth);
            set({ isLoading: false, isModalUpdateVisible: false });
            toast.success('Entreprise modifiée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useCompanyStore };
