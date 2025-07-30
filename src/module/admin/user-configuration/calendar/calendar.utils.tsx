import { Spin, Tooltip } from 'antd';
import { addDays, format, getHours, getISODay, getMinutes, hoursToMilliseconds, isBefore, minutesToMilliseconds } from 'date-fns';
import { Event } from 'react-big-calendar';
import { CiTimer } from 'react-icons/ci';
import { FaCar } from 'react-icons/fa';
import { ListOfWorkDays } from '../../admin-configuration/adminConfiguration.utils';
import { WorkTypeType } from '../../admin-configuration/workType/workTypeTable/workTypeTable.utils';
import { useCalendarStore } from './_store/calendar.store';

export interface CalendarStyle {
    style: React.CSSProperties;
}

export enum LocationWorkEnum {
    OFFICE = 'Bureau',
    HOME = 'Télétravail',
    CP = 'Congés payés',
    RTT = 'RTT',
    OFF = 'Absence',
}

export const workCase: string[] = [LocationWorkEnum.OFFICE, LocationWorkEnum.HOME] as string[];

export const presenceCase: string[] = [
    LocationWorkEnum.CP,
    LocationWorkEnum.RTT,
    LocationWorkEnum.OFF,
    LocationWorkEnum.HOME,
    LocationWorkEnum.OFFICE,
] as string[];

export interface CustomEvent extends Event {
    titleAm: LocationWorkEnum | string;
    titlePm: LocationWorkEnum | string;
    start: Date;
    end: Date;
    hourlyAm: string;
    hourlyPm: string;
    workTime: string;
    parking: boolean;
    workType?: WorkTypeType;
    id: string;
}

export type NavigateAction = 'PREV' | 'NEXT' | 'TODAY';

export const eventStyleGetter = (event: CustomEvent): CalendarStyle => {
    const style: React.CSSProperties = {
        backgroundColor: 'transparent',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        textAlign: 'center',
        display: 'block',
    };
    return {
        style,
    };
};

export const dayStyleGetter = (event: Date): CalendarStyle => {
    let borderTop = '0px';
    let backgroundColor = '';
    if (format(event, 'dd MM') === format(new Date(), 'dd MM')) {
        borderTop = '2px solid #3174ad';
    }
    if (event.getDay() === 0 || event.getDay() === 6) {
        backgroundColor = '#e7e7e7';
    }
    const style: React.CSSProperties = {
        borderTop,
        backgroundColor,
    };
    return {
        style,
    };
};

export type CalendarStateType = {
    events: CustomEvent[];
    isLoading: boolean;
    isError: boolean;
    eventId: string;
    deleteEventModal: boolean;
    updateEventModal: boolean;
    choiceEventModal: boolean;
    createEventModal: boolean;
    date: Date;
    setDate: (date: Date) => void;
    setCreateEventModal: (createEventModal: boolean) => void;
    setChoiceEventModal: (choiceEventModal: boolean) => void;
    setEventId: (eventId: string) => void;
    setUpdateEventModal: (updateEventModal: boolean) => void;
    setDeleteEventModal: (deleteEventModal: boolean) => void;
    setIsError: (isError: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setEvents: (userId: string, date: Date) => Promise<void>;
    deleteEvent: (eventId: string, userId: string) => Promise<void>;
};

export enum colorPresenceEnum {
    HOME = 'orange-500',
    OFFICE = 'primary',
    ABS = 'gray-500',
}

export const colorPresenceCase = (workCase: LocationWorkEnum | string) => {
    switch (workCase) {
        case LocationWorkEnum.HOME:
            return colorPresenceEnum.HOME;
        case LocationWorkEnum.OFFICE:
            return colorPresenceEnum.OFFICE;
        case LocationWorkEnum.CP:
            return colorPresenceEnum.ABS;
        case LocationWorkEnum.RTT:
            return colorPresenceEnum.ABS;
        default:
            return colorPresenceEnum.ABS;
    }
};

export const EventComponent: React.FC<{ event: CustomEvent }> = ({ event }) => {
    const { isLoading } = useCalendarStore();
    if (isLoading) {
        return <div><Spin /></div>;
    } 
    if (!workCase.includes(event.titleAm) && !workCase.includes(event.titlePm) && event.titleAm === event.titlePm) {
        return (
            <div className="text-sm flex flex-col justify-between md:min-h-[90px] overflow-hidden">
                <div className="flex justify-start font-bold">
                    <p>{event.titleAm}</p>
                </div>
                <Tooltip placement="top" title={event.titleAm} arrow={true}>
                    <div
                        className={`bg-${colorPresenceCase(
                            event.titleAm
                        )} rounded-md shadow-lg py-1 w-full text-slate-200 min-h-6 max-h-6`}
                    ></div>
                </Tooltip>
            </div>
        );
    } else {
        return (
            <div className="text-sm flex flex-col justify-between md:min-h-[90px] overflow-hidden ">
                <div>
                    {workCase.includes(event.titleAm) ? (
                        <div className="flex justify-start font-bold">
                            <p>{event.hourlyAm}</p>
                        </div>
                    ) : (
                        <div className="flex justify-start font-bold">
                            <p>{event.titleAm}</p>
                        </div>
                    )}

                    {workCase.includes(event.titlePm) ? (
                        <div className="flex justify-start font-bold">
                            <p>{event.hourlyPm}</p>
                        </div>
                    ) : (
                        <div className="flex justify-start font-bold">
                            <p>{event.titlePm}</p>
                        </div>
                    )}
                </div>

                {(workCase.includes(event.titleAm) || workCase.includes(event.titlePm)) && (
                    <div className="flex justify-start items-center italic gap-1">
                        <CiTimer />
                        <div className="flex justify-center gap-2">
                            <Tooltip
                                title={
                                    event.workType
                                        ? verifyIsCorrectHour(event.workTime, event.workType, getISODay(event.start))
                                            ? ''
                                            : `Le temps de travail déclaré ne correspond pas aux ${getHoursToRespect(event.workType, getISODay(event.start))} attendues.`
                                        : 'Type de travail non défini'
                                }
                            >
                                <p
                                    className={` ${
                                        event.workType
                                            ? verifyIsCorrectHour(
                                                  event.workTime,
                                                  event.workType,
                                                  getISODay(event.start)
                                              )
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            : 'text-gray-600'
                                    } font-semibold`}
                                >
                                    {event.workTime}
                                </p>
                            </Tooltip>
                            <div className={`${event.parking ? 'flex gap-2 items-center' : 'hidden'}`}>
                                <span> - </span>{' '}
                                <Tooltip title="Place de parking">
                                    <FaCar />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <Tooltip
                        placement="top"
                        title={event.titleAm === event.titlePm ? event.titlePm : event.titleAm + ' / ' + event.titlePm}
                        arrow={true}
                    >
                        {event.titleAm === event.titlePm && workCase.includes(event.titleAm) ? (
                            <div
                                className={`rounded-md shadow-lg py-1 min-h-6 max-h-6 bg-${colorPresenceCase(
                                    event.titleAm
                                )}`}
                            ></div>
                        ) : (
                            <div
                                className={`bg-gradient-to-r from-${colorPresenceCase(
                                    event.titleAm
                                )} from-50% to-${colorPresenceCase(
                                    event.titlePm
                                )} to-50% rounded-md shadow-lg py-1 min-h-6 max-h-6`}
                            ></div>
                        )}
                    </Tooltip>
                </div>
            </div>
        );
    }
};

export const checkDateBeforeThreeDays = (eventDate: Date, updateDelay: number): boolean => {
    if (eventDate) {
        const verifyDate = addDays(new Date(), updateDelay);
        return isBefore(verifyDate, eventDate);
    } else {
        return false;
    }
};

export const isSameIsoDay = (day: string, date: Date): boolean => {
    const index: number = ListOfWorkDays.findIndex(dayName => dayName === day);
    return getISODay(date) === index + 1;
};

export const verifyIsCorrectHour = (workTime: string, workType: WorkTypeType, isoDay: number): boolean => {
    const workTimeSplite = workTime.split(':');
    const hourWorkTimeSplit = workTimeSplite[0].split('');
    const hourWorkTime =
        hourWorkTimeSplit[0] === '0' ? parseInt(workTimeSplite[0].split('0')[1]) : parseInt(workTimeSplite[0]);
    const minuteWorkTime = parseInt(workTimeSplite[1]);

    const totalWorkTimeMs = hoursToMilliseconds(hourWorkTime) + minutesToMilliseconds(minuteWorkTime);
    if (!workType) return false;
    switch (isoDay) {
        case 1:
            return totalWorkTimeMs === hoursToMilliseconds(parseFloat(workType.monday));
        case 2:
            return totalWorkTimeMs === hoursToMilliseconds(parseFloat(workType.tuesday));
        case 3:
            return totalWorkTimeMs === hoursToMilliseconds(parseFloat(workType.wednesday));
        case 4:
            return totalWorkTimeMs === hoursToMilliseconds(parseFloat(workType.thursday));
        default:
            return totalWorkTimeMs === hoursToMilliseconds(parseFloat(workType.friday));
    }
};

export const getHoursToRespect = (workType: WorkTypeType, isoDay: number): string => {
    switch (isoDay) {
        case 1:
            return `${getHours(hoursToMilliseconds(parseFloat(workType.monday))) - 1}h${getMinutes(hoursToMilliseconds(parseFloat(workType.monday))) === 0 ? '' : getMinutes(hoursToMilliseconds(parseFloat(workType.monday)))}`;
        case 2:
            return `${getHours(hoursToMilliseconds(parseFloat(workType.tuesday))) - 1}h${getMinutes(hoursToMilliseconds(parseFloat(workType.tuesday)))  === 0 ? '' : getMinutes(hoursToMilliseconds(parseFloat(workType.tuesday)))}`;
        case 3:
            return `${getHours(hoursToMilliseconds(parseFloat(workType.wednesday))) - 1}h${getMinutes(hoursToMilliseconds(parseFloat(workType.wednesday)))  === 0 ? '' : getMinutes(hoursToMilliseconds(parseFloat(workType.wednesday)))}`;
        case 4:
            return `${getHours(hoursToMilliseconds(parseFloat(workType.thursday)))- 1}h${getMinutes(hoursToMilliseconds(parseFloat(workType.thursday)))  === 0 ? '' : getMinutes(hoursToMilliseconds(parseFloat(workType.thursday)))}`;
        default:
            return `${getHours(hoursToMilliseconds(parseFloat(workType.friday))) - 1}h${getMinutes(hoursToMilliseconds(parseFloat(workType.friday)))  === 0 ? '' : getMinutes(hoursToMilliseconds(parseFloat(workType.friday)))}`;
    }
};

export const createNumberList = (start: number, end: number): number[] => {
    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(i);
    }
    return numbers;
};
