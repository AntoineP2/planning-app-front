import { milliseconds } from "date-fns";
import { LocationWorkEnum } from "~/module/calendar/calendar.utils";
import { calculateWorkTime, createDate, defineFinaleWorkTime, formatHourly, HourlyCaseEnum } from "~/module/calendar/calendarForm/calendarForm.utils";
import { AccountProfileType } from "../accountProfile.utils";

export type AccountProfileFormStoreType = {
    name: string;
    hourAmStart: number;
    hourAmEnd: number;
    minuteAmStart: number;
    minuteAmEnd: number;
    hourPmStart: number;
    hourPmEnd: number;
    minutePmStart: number;
    minutePmEnd: number;
    isLoading: boolean;
    setName: (value: string) => void;
    setDataEvent: (event: AccountProfileType) => void;
    setSelectedTimeValue: (value: React.ChangeEvent<HTMLSelectElement>, hourlyCase: HourlyCaseEnum) => void;
    resetData: () => void;
    createEventProfile: (data: CreateEventProfileInputType) => Promise<void>
    deleteEventProfile: (id: string) => Promise<void>
    updateEventProfile: (data: UpdateEventProfileInputType, userId: string) => Promise<void>
};

export type EventProfilFormType = {
    name: string;
    titleAm: LocationWorkEnum;
    titlePm: LocationWorkEnum;
    start: Date;
    end: Date;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;

};

type DataFormatType = {
    name: string;
    hourAmStart: number;
    hourAmEnd: number;
    hourPmStart: number;
    hourPmEnd: number;
    minuteAmStart: number;
    minuteAmEnd: number;
    minutePmStart: number;
    minutePmEnd: number;
    parking: boolean;
    titleAm: LocationWorkEnum | string;
    titlePm: LocationWorkEnum | string;
    userId: string;
    isPublic: boolean;
};

export type EventDataType = {
    name: string;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    titleAm: LocationWorkEnum | string;
    titlePm: LocationWorkEnum | string;
    ownerId: string;
    parking: boolean;
    isPublic: boolean;
};

export const formatData = ({
    name,
    hourAmStart,
    hourAmEnd,
    hourPmStart,
    hourPmEnd,
    minuteAmStart,
    minuteAmEnd,
    minutePmStart,
    minutePmEnd,
    titleAm,
    titlePm,
    parking,
    userId,
    isPublic,
}: DataFormatType): EventDataType => {
    const hourlyAmStart = createDate(hourAmStart, minuteAmStart);
    const hourlyAmEnd = createDate(hourAmEnd, minuteAmEnd);
    const hourlyPmStart = createDate(hourPmStart, minutePmStart);
    const hourlyPmEnd = createDate(hourPmEnd, minutePmEnd);
    const amWorkTime = calculateWorkTime(hourlyAmEnd, hourlyAmStart);
    const pmWorkTime = calculateWorkTime(hourlyPmEnd, hourlyPmStart);
    const amWorkTimeMs =
        milliseconds({ hours: amWorkTime.getHours() }) + milliseconds({ minutes: amWorkTime.getMinutes() });
    const pmWorkTimeMs =
        milliseconds({ hours: pmWorkTime.getHours() }) + milliseconds({ minutes: pmWorkTime.getMinutes() });

    const eventData = {
        name,
        hourlyAm: formatHourly(hourlyAmStart, hourlyAmEnd),
        hourlyPm: formatHourly(hourlyPmStart, hourlyPmEnd),
        workTime: defineFinaleWorkTime(titleAm, titlePm, amWorkTimeMs, pmWorkTimeMs),
        titleAm,
        titlePm,
        ownerId: userId,
        parking,
        isPublic,
    };
    return eventData;
};

export type CreateEventProfileInputType = {
    name: string;
    titleAm: string;
    titlePm: string;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    ownerId: string;
    isPublic: boolean;
    parking: boolean;
  };

export type UpdateEventProfileInputType = {
    id: string;
    name: string;
    titleAm: string;
    titlePm: string;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    ownerId: string;
    isPublic: boolean;
    parking: boolean;
};