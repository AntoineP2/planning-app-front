import { addHours, addMilliseconds, format, milliseconds } from 'date-fns';
import { LocationWorkEnum, workCase } from '../calendar.utils';

export type PresenceEventType = {
    titleAm: LocationWorkEnum;
    titlePm: LocationWorkEnum;
    start: Date;
    end: Date;
    date: Date[];
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    allDay: boolean;
};

export enum HourlyCaseEnum {
    HAMS = 'hourAmStart',
    HPMS = 'hourPmStart',
    MAMS = 'minuteAmStart',
    MPMS = 'minutePmStart',
    HAME = 'hourAmEnd',
    HPME = 'hourPmEnd',
    MAME = 'minuteAmEnd',
    MPME = 'minutePmEnd',
}

export type CalendarFormStateType = {
    hourAmStart: number;
    hourAmEnd: number;
    minuteAmStart: number;
    minuteAmEnd: number;
    hourPmStart: number;
    hourPmEnd: number;
    minutePmStart: number;
    minutePmEnd: number;
    selectedDate: string[];
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
    setSelectedDate: (date: string[]) => void;
    setSelectedTimeValue: (value: React.ChangeEvent<HTMLSelectElement>, hourlyCase: HourlyCaseEnum) => void;
    resetData: () => void;
    createEvents: (eventsData: CreateEventDataType) => Promise<void>;
};

type DataFormatType = {
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
    selectedDate: string[];
};

export type EventDataType = {
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    titleAm: LocationWorkEnum | string;
    titlePm: LocationWorkEnum | string;
    userId: string;
    parking: boolean;
    date: string[];
};

// TODO : Modifier ici les valeurs de workTime en fonction des heures de travail et du title

export const defineFinaleWorkTime = (
    titleAm: LocationWorkEnum | string,
    titlePm: LocationWorkEnum | string,
    amWorkTimeMs: number,
    pmWorkTimeMs: number
): string => {
    if (!workCase.includes(titleAm) && workCase.includes(titlePm)) {
        return format(addHours(addMilliseconds(new Date(0), pmWorkTimeMs), -1), 'HH:mm');
    }
    if (workCase.includes(titleAm) && !workCase.includes(titlePm)) {
        return format(addHours(addMilliseconds(new Date(0), amWorkTimeMs), -1), 'HH:mm');
    }
    if (workCase.includes(titleAm) && workCase.includes(titlePm)) {
        return format(addHours(addMilliseconds(new Date(0), pmWorkTimeMs + amWorkTimeMs), -1), 'HH:mm');
    } else {
        return '00:00';
    }
};

// TODO : Modifier couleur case des jour passé

export const formatData = ({
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
    selectedDate,
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
        hourlyAm: formatHourly(hourlyAmStart, hourlyAmEnd),
        hourlyPm: formatHourly(hourlyPmStart, hourlyPmEnd),
        workTime: defineFinaleWorkTime(titleAm, titlePm, amWorkTimeMs, pmWorkTimeMs),
        titleAm,
        titlePm,
        userId,
        parking,
        date: selectedDate,
    };
    return eventData;
};

const createDate = (hour: number, minute: number): Date => {
    return new Date(0, 0, 0, hour, minute);
};

const formatHourly = (hourlyStart: Date, hourlyEnd: Date): string => {
    return hourlyStart > hourlyEnd
        ? `${format(hourlyEnd, 'HH:mm')} - ${format(hourlyStart, 'HH:mm')}`
        : `${format(hourlyStart, 'HH:mm')} - ${format(hourlyEnd, 'HH:mm')}`;
};

const calculateWorkTime = (hourlyStart: Date, hourlyEnd: Date): Date => {
    return hourlyStart > hourlyEnd
        ? addHours(hourlyStart.getTime() - hourlyEnd.getTime(), -1)
        : addHours(hourlyEnd.getTime() - hourlyStart.getTime(), -1);
};

export type CreateEventDataType = {
    titleAm: string;
    titlePm: string;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    userId: string;
    parking: boolean;
    date: string[];
};

export type UpdateEventDataType = {
    titleAm: string;
    titlePm: string;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    parking: boolean;
    userId: string;
    id: string;
};
