import { get } from "lodash";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { create } from "zustand";
import { AccountProfileFormStoreType } from "../accountProfileForm.utils";
import { createEventProfileApi, deleteEventProfileApi, updateEventProfileApi } from "./accountProfilForm.api";
import { HourlyCaseEnum } from "~/module/calendar/calendarForm/calendarForm.utils";
import { formatHourMinute } from "~/module/calendar/calendarUpdateForm/calendarUpdateForm.utils";

const useAccountProfileFormStore = create<AccountProfileFormStoreType>(set => ({
    name: '',
    hourAmEnd: 12,
    hourAmStart: 8,
    hourPmEnd: 17,
    hourPmStart: 13,
    minuteAmEnd: 0,
    minuteAmStart: 0,
    minutePmEnd: 0,
    minutePmStart: 0,
    isLoading: false,
    setName: (name: string) => set({ name }),
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
            name: '',
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
    createEventProfile: async createEventProfileInput => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await createEventProfileApi(createEventProfileInput, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil créé avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateEventProfile: async (createEventProfileInput, userId )=> {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateEventProfileApi(createEventProfileInput, userId, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil modifié avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    deleteEventProfile: async id => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await deleteEventProfileApi(id, tokenAuth);
            set({ isLoading: false });
            toast.success('Profil supprimé avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}))

export { useAccountProfileFormStore };