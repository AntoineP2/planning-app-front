import { get } from "lodash";
import { AccountProfileStoreType, AccountProfileType, formatTableDataAccountProfile } from "../accountProfile.utils";
import { getAllEventProfileByUserOwnerIdApi } from "./accountProfile.api";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { create } from "zustand";

const useAccountProfileStore = create<AccountProfileStoreType>(set => ({
    isLoading: false,
    profilesList: [],
    profilesListFormatted: [],
    modalState: 'close',
    profileSelected: {
        id: '',
        name: '',
        titleAm: '',
        titlePm: '',
        parking: false,
        hourlyAm: '',
        hourlyPm: '',
        workTime: '',
        isPublic: false,
        ownerId: '',
    },
    setProfileSelected: (profile: AccountProfileType) => {
        set({ profileSelected: profile });
    },
    setModalState: (state: 'close' | 'edit' | 'create' | 'delete') => {
        set({ modalState: state });
    },
    resetProfileSelected: () => {
        set({
            profileSelected: {
                id: '',
                name: '',
                titleAm: '',
                titlePm: '',
                parking: false,
                hourlyAm: '',
                hourlyPm: '',
                workTime: '',
                isPublic: false,
                ownerId: '',
            }
        });
    },
    getProfilesList: async (userId: string) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const profilesList = await getAllEventProfileByUserOwnerIdApi(userId, tokenAuth);
            const profilesListFormatted = formatTableDataAccountProfile(profilesList);
            set({ profilesList, profilesListFormatted, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}))

export { useAccountProfileStore };