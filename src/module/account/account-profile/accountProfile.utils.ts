import { LocationWorkEnum } from "~/module/calendar/calendar.utils"

export type AccountProfileStoreType = {

    profilesList: AccountProfileType[]
    profilesListFormatted: AccountProfileTableType[]
    isLoading: boolean
    profileSelected: AccountProfileType
    modalState: 'close' | 'edit' | 'create' | 'delete'
    setProfileSelected: (profile: AccountProfileType) => void
    resetProfileSelected: () => void
    setModalState: (state: 'close' | 'edit' | 'create' | 'delete') => void
    getProfilesList: (userId: string) => Promise<void>
}


export type AccountProfileType = {
        id: string;
        name: string;
        titleAm: LocationWorkEnum | string;
        titlePm: LocationWorkEnum | string;
        parking: boolean;
        hourlyAm: string;
        hourlyPm: string;
        workTime: string;
        isPublic: boolean;
        ownerId: string;       
}

export type AccountProfileTableType = {
    key: string;
    name: string;
    titleAm: LocationWorkEnum | string;
    titlePm: LocationWorkEnum | string;
    parking: boolean;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    isPublic: boolean;
    ownerId: string;       
}

export const formatTableDataAccountProfile = (
    data: AccountProfileType[],
): AccountProfileTableType[] => {
    const dataFormatted = data.map((accountProfile) => {
        return {
            key: accountProfile.id,
            name: accountProfile.name,
            titleAm: accountProfile.titleAm,
            titlePm: accountProfile.titlePm,
            parking: accountProfile.parking,
            hourlyAm: accountProfile.hourlyAm,
            hourlyPm: accountProfile.hourlyPm,
            workTime: accountProfile.workTime,
            isPublic: accountProfile.isPublic,
            ownerId: accountProfile.ownerId,
        }
    });

    return dataFormatted;
};
  