import { WorkTypeType } from './workType/workTypeTable/workTypeTable.utils';

export type adminConfigurationStoreStateType = {
    parkingPlaces: number;
    isLoading: boolean;
    officeDay: string;
    updateDelay: string;
    timeRange: string;
    isLoadingUpdateDelay: boolean;
    isLoadingOfficeDay: boolean;
    isLoadingHoliday: boolean;
    isBeforeThreeDays: boolean;
    isLoadingWorkTypeDefault: boolean;
    isLoadingTimeRange: boolean;
    workTypeDefault: WorkTypeType;
    setIsBeforeThreeDays: (eventDate: Date) => Promise<void>;
    setParkingPlacesToSave: (parkingPlaces: number) => void;
    setParkingPlaces: () => Promise<void>;
    setOfficeDay: (officeDay: string) => void;
    getTimeRange: () => Promise<void>;
    getOfficeDay: () => Promise<void>;
    getWorkTypeDefault: () => Promise<void>;
    setUpdateDelay: (delay: string) => void;
    getUpdateDelay: () => Promise<void>;
    updateOfficeDay: (officeDay: string) => Promise<void>;
    updateParkingPlaces: (parkingPlaces: number) => void;
    updateHoliday: (year: number) => Promise<void>;
    updateUpdateDelay: (delay: string) => Promise<void>;
    updateWorkTypeDefault: (workTypeId: string) => Promise<void>;
    updateTimeRange: (timeRange: string) => Promise<void>;
};

export enum CONFIGURATION_ADMIN_NAME {
    PARKING_PLACES = 'ParkingPlace',
    OFFICE_DAY = 'OfficeDay',
    UPDATE_DELAY = 'UpdateDelay',
    WORK_TYPE_DEFAULT = 'WorkTypeDefault',
    TIME_RANGE = 'TimeRange',
}
export const ListOfWorkDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
