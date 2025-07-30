import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { formatParkingPlaceList, ParkingPlaceStoreStateType } from '../parkingPlace.utils';
import { createParkingPlaceApi, deleteParkingPlaceApi, getAllParkingPlaceApi, updateParkingPlaceApi } from './parkingPlace.api';

const useParkingPlaceStore = create<ParkingPlaceStoreStateType>(set => ({
    isLoading: false,
    parkingPlaceList: [],
    parkingPlaceTableList: [],
    parkingPlaceSelected: {
        id: '',
        name: '',
        chargingStation: false,
        underground: false,
        entrepriseId: '',
    },

    activeModal: null,

    setActiveModal: modal => set({ activeModal: modal }),

    setParkingPlaceSelected: value => set({ parkingPlaceSelected: value }),

    getAllParkingPlace: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const parkingPlaceList = await getAllParkingPlaceApi(tokenAuth);
            set({ isLoading: false, parkingPlaceList, parkingPlaceTableList: formatParkingPlaceList(parkingPlaceList) });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    createParkingPlace: async (parkingPlace) => {
        try {
            const { name, chargingStation, underground, entrepriseId } = parkingPlace;
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await createParkingPlaceApi(name, chargingStation, underground, entrepriseId, tokenAuth);
            set({ isLoading: false, activeModal: null });
            toast.success('Place de parking créée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    deleteParkingPlace: async id => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await deleteParkingPlaceApi(id, tokenAuth);
            set({ isLoading: false });
            toast.success('Place de parking supprimée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateParkingPlace: async parkingPlace => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateParkingPlaceApi(parkingPlace, tokenAuth);
            set({ isLoading: false, activeModal: null });
            toast.success('Place de parking modifiée avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useParkingPlaceStore };
