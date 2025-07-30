import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { checkDateBeforeThreeDays } from '~/module/calendar/calendar.utils';
import { adminConfigurationStoreStateType, CONFIGURATION_ADMIN_NAME } from '../adminConfiguration.utils';
import {
    getConfigurationParamsApi,
    getConfigurationParkingPlaceApi,
    getWorkTypeByIdApi,
    updateAdminConfigurationApi,
    updateOrCreateHolidayApi,
} from './adminConfiguration.api';

const useAdminConfigurationStore = create<adminConfigurationStoreStateType>(set => ({
    parkingPlaces: 0,
    isLoading: false,
    isLoadingOfficeDay: false,
    isLoadingHoliday: false,
    isLoadingUpdateDelay: false,
    isLoadingWorkTypeDefault: false,
    isLoadingTimeRange: false,
    timeRange: '',
    officeDay: '',
    updateDelay: '0',
    isBeforeThreeDays: false,
    workTypeDefault: {
        id: '',
        name: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        weeklyHour: '',
    },
    setOfficeDay: officeDay => {
        set({ officeDay });
    },
    setParkingPlacesToSave: parkingPlaces => {
        set({ parkingPlaces });
    },
    setUpdateDelay: delay => {
        set({ updateDelay: delay });
    },
    setParkingPlaces: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await getConfigurationParkingPlaceApi(tokenAuth);
            set({
                isLoading: false,
                parkingPlaces: response.value,
            });
        } catch (e) {
            set({ isLoading: false });
        }
    },

    setIsBeforeThreeDays: async eventDate => {
        try {
            set({ isLoadingUpdateDelay: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await getConfigurationParamsApi(CONFIGURATION_ADMIN_NAME.UPDATE_DELAY, tokenAuth);
            const delay = parseInt(response.value);
            set({
                isLoadingUpdateDelay: false,
            });
            set({ isBeforeThreeDays: checkDateBeforeThreeDays(eventDate, delay) });
        } catch (error) {
            set({ isLoadingUpdateDelay: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    getOfficeDay: async () => {
        try {
            set({ isLoadingOfficeDay: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await getConfigurationParamsApi(CONFIGURATION_ADMIN_NAME.OFFICE_DAY, tokenAuth);
            set({
                isLoadingOfficeDay: false,
                officeDay: response.value as string,
            });
        } catch (error) {
            set({ isLoadingOfficeDay: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    getTimeRange: async () => {
        try {
            set({ isLoadingTimeRange: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await getConfigurationParamsApi(CONFIGURATION_ADMIN_NAME.TIME_RANGE, tokenAuth);
            set({
                isLoadingTimeRange: false,
                timeRange: response.value as string,
            });
        } catch (error) {
            set({ isLoadingTimeRange: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    getUpdateDelay: async () => {
        try {
            set({ isLoadingUpdateDelay: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await getConfigurationParamsApi(CONFIGURATION_ADMIN_NAME.UPDATE_DELAY, tokenAuth);
            set({
                isLoadingUpdateDelay: false,
                updateDelay: response.value,
            });
        } catch (error) {
            set({ isLoadingUpdateDelay: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    getWorkTypeDefault: async () => {
        try {
            set({ isLoadingWorkTypeDefault: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const workTypeDefaultId = await getConfigurationParamsApi(
                CONFIGURATION_ADMIN_NAME.WORK_TYPE_DEFAULT,
                tokenAuth
            );
            const response = await getWorkTypeByIdApi(workTypeDefaultId.value, tokenAuth);
            set({
                isLoadingWorkTypeDefault: false,
                workTypeDefault: response,
            });
        } catch (error) {
            set({ isLoadingWorkTypeDefault: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    updateParkingPlaces: async parkingPlaces => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';

            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            await updateAdminConfigurationApi(
                CONFIGURATION_ADMIN_NAME.PARKING_PLACES,
                parkingPlaces.toString(),
                tokenAuth
            );
            set({ isLoading: false });
            toast.success('Le nombre de places de parking a été mis à jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoading: false });
        }
    },

    updateTimeRange: async timeRange => {
        try {
            set({ isLoadingTimeRange: true });
            let tokenAuth = '';

            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            await updateAdminConfigurationApi(CONFIGURATION_ADMIN_NAME.TIME_RANGE, timeRange, tokenAuth);
            set({ isLoadingTimeRange: false });
            toast.success('Les plages horaires de présence ont été mis à jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoadingTimeRange: false });
        }
    },

    updateOfficeDay: async officeDay => {
        try {
            set({ isLoadingOfficeDay: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            await updateAdminConfigurationApi(CONFIGURATION_ADMIN_NAME.OFFICE_DAY, officeDay, tokenAuth);
            set({ isLoadingOfficeDay: false });
            toast.success('Le jour de présence obligatoire a été mis à jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoadingOfficeDay: false });
        }
    },

    updateHoliday: async (year: number) => {
        try {
            set({ isLoadingHoliday: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            await updateOrCreateHolidayApi(year, tokenAuth);
            set({ isLoadingHoliday: false });
            toast.success('Les jours fériés ont été mis à jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoadingHoliday: false });
        }
    },

    updateUpdateDelay: async delay => {
        try {
            set({ isLoadingUpdateDelay: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            await updateAdminConfigurationApi(CONFIGURATION_ADMIN_NAME.UPDATE_DELAY, delay, tokenAuth);
            set({ isLoadingUpdateDelay: false });
            toast.success('Le jour de présence obligatoire a été mis à jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoadingUpdateDelay: false });
        }
    },

    updateWorkTypeDefault: async workTypeId => {
        try {
            set({ isLoadingWorkTypeDefault: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) {
                tokenAuth = getCookie('tokenAuth') as string;
            }
            const response = await updateAdminConfigurationApi(
                CONFIGURATION_ADMIN_NAME.WORK_TYPE_DEFAULT,
                workTypeId,
                tokenAuth
            );
            const workTypeDefaultUpdate = await getWorkTypeByIdApi(response.value, tokenAuth);

            set({ isLoadingWorkTypeDefault: false, workTypeDefault: workTypeDefaultUpdate });
            toast.success('Le profil par défaut a été mis a jour avec succès.');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            set({ isLoadingWorkTypeDefault: false });
        }
    },
}));

export { useAdminConfigurationStore };
