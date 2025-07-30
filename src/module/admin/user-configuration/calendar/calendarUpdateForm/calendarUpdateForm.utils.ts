import { CustomEvent } from '../calendar.utils';
import { HourlyCaseEnum, UpdateEventDataType } from '../calendarForm/calendarForm.utils';

export type CalendarUpdateFormStateType = {
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
    isLoadingParking: boolean;
    event: CustomEvent;
    parkingPlacesTaken: number;
    setDataEvent: (event: CustomEvent) => void;
    setEvent: (event: CustomEvent) => void;
    setIsLoading: (value: boolean) => void;
    setSelectedDate: (date: string[]) => void;
    setSelectedTimeValue: (value: React.ChangeEvent<HTMLSelectElement>, hourlyCase: HourlyCaseEnum) => void;
    resetData: () => void;
    updateEvent: (eventsData: UpdateEventDataType) => Promise<void>;
    setParkingPlacesCountByDate: (date: Date) => Promise<number>;
};

export const formatHourMinute = (hourly: string): string[] => {
    const hourlySplitStart = hourly.split('-')[0].split(':');
    const hourlySplitEnd = hourly.split('-')[1].split(':');

    const formatHourStart =
        hourlySplitStart[0].split('')[0] === '0' ? hourlySplitStart[0].split('')[1] : hourlySplitStart[0];
    const formatMinuteStart =
        hourlySplitStart[1].split('')[0] === '0' ? hourlySplitStart[1].split('')[1] : hourlySplitStart[1];

    const formatHourEnd = hourlySplitEnd[0].split('')[0] === '0' ? hourlySplitEnd[0].split('')[1] : hourlySplitEnd[0];
    const formatMinuteEnd = hourlySplitEnd[1].split('')[0] === '0' ? hourlySplitEnd[1].split('')[1] : hourlySplitEnd[1];

    return [formatHourStart, formatMinuteStart, formatHourEnd, formatMinuteEnd];
};
