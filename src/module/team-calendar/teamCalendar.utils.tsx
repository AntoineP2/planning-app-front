import { addDays, eachDayOfInterval, format, isMonday, previousMonday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WorkTypeType } from '../admin/admin-configuration/workType/workTypeTable/workTypeTable.utils';
import { CustomEvent, EventComponentTeam, LocationWorkEnum } from '../calendar/calendar.utils';
import TeamCalendarButton from './teamCalendar.accessButtonCalendar.component';
import { FaChargingStation } from 'react-icons/fa';
import { UserConfigurationType } from '../admin/user-configuration/user-list/userList.utils';
import { Tooltip } from 'antd';

export enum TABLE_CHOICE_ENUM {
    PLANNING = 'planning',
    PARKING = 'parking',
}

export type TeamCalendarStateType = {
    isLoading: boolean;
    isWorkTypeLoading: boolean;
    isParkingPlacesResourcesLoading: boolean;
    workType: WorkTypeType[];
    workTypeFilter: string[];
    nameWorkerFilter: UserTeamViewType[];
    usersWithEventsList: EmployeeEventCalendarType[];
    dataTableFormatted: TablePropsType[];
    daysOfWeek: Date[];
    dataColumns: any[];
    parkingPlacesRessources: ParkingPlaceResourceType[];
    dataTableParkingRessourcesFormatted: TableParkingPropsType[];
    dataParkingRessourcesColumns: any[];
    tableState: TABLE_CHOICE_ENUM;
    getParkingPlacesRessources: (dateList: Date[], userId: string, userList: UserConfigurationType[] | null) => Promise<void>;
    setTableState: (tableState: TABLE_CHOICE_ENUM) => void;
    setWorkType: () => Promise<void>;
    setWorkTypeFilter: (checked: boolean, workTypeName: string) => void;
    setUsersWithEventsList: (dateList: Date[]) => Promise<void>;
    setDaysOfWeek: (date: string | Date) => void;
};

export type EventCalendarType = {
    id: string;
    start: Date;
    end: Date;
    hourlyAm: string;
    hourlyPm: string;
    titleAm: string;
    titlePm: string;
    workTime: string;
};

export type EmployeeEventCalendarType = {
    firstName: string;
    lastName: string;
    id: string;
    workTypeId: string;
    EventCalendar: CustomEvent[];
};

export type TableParkingPropsType = {
    key: number | number;
    name: string | undefined;
    parkingPlaceId: string | undefined;
    underground: boolean;
    chargingStation: boolean;
    monday: ParkingPlaceBookingType | null;
    tuesday: ParkingPlaceBookingType | null;
    wednesday: ParkingPlaceBookingType | null;
    thursday: ParkingPlaceBookingType | null;
    friday: ParkingPlaceBookingType | null;
};

export type UserTeamViewType = {
    name: string;
    id: string;
}

export type ParkingPlaceResourceType = {
    id: string;
    name: string;
    underground: boolean;
    chargingStation: boolean;
    entrepriseId: string;
    ParkingPlaceBooking: ParkingPlaceBookingType[];
};

export type ParkingPlaceBookingType = {
    id: string;
    date: string;
    userId: string;
};

export type TablePropsType = {
    key: number | number;
    name: string | undefined;
    userId: string | undefined;
    workType: string | undefined;
    monday: CustomEvent | null;
    tuesday: CustomEvent | null;
    wednesday: CustomEvent | null;
    thursday: CustomEvent | null;
    friday: CustomEvent | null;
};

export const formatTableDataEvent = (
    data: EmployeeEventCalendarType[],
    daysOfWeek: Date[],
    workType: WorkTypeType[],
    workTypeFilter: string[]
): TablePropsType[] => {
    const dataFormatted = data.map((user, index) => {
        return {
            key: index,
            name: `${user.firstName} ${user.lastName.toUpperCase()}`,
            userId: user.id,
            workType: workType.find(type => type.id === user.workTypeId)?.name as LocationWorkEnum,
            monday: setEventByDay(user.EventCalendar, daysOfWeek[0], workType.find(type => type.id === user.workTypeId)),
            tuesday: setEventByDay(user.EventCalendar, daysOfWeek[1], workType.find(type => type.id === user.workTypeId)),
            wednesday: setEventByDay(user.EventCalendar, daysOfWeek[2], workType.find(type => type.id === user.workTypeId)),
            thursday: setEventByDay(user.EventCalendar, daysOfWeek[3], workType.find(type => type.id === user.workTypeId)),
            friday: setEventByDay(user.EventCalendar, daysOfWeek[4], workType.find(type => type.id === user.workTypeId)),
        }
    });
    const dataFormattedFilter = dataFormatted.filter(data =>
        data.workType ? workTypeFilter.includes(data.workType) : data);

    dataFormattedFilter.sort((a, b) => b.workType.localeCompare(a.workType));
    return dataFormattedFilter;
};

export const setEventByDay = (events: CustomEvent[], dayOfWeek: Date, workType: WorkTypeType | undefined) => {
    const event = events.find(event => format(dayOfWeek, 'EEEE') === format(event.start, 'EEEE'));
    return event ? { ...event, workType: workType } : null
};

export const setDayInterval = (date: string | Date): Date[] => {
    const entryDate = new Date(date);
    const startDate = isMonday(entryDate) ? entryDate : previousMonday(entryDate);
    const endDate = addDays(startDate, 4);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days;
};

export const setDefaultColumns = (nameWorkerFilter: UserTeamViewType[], workType: WorkTypeType[]): any[] => {
    const defaultColumns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: 'ascend',
            filters: nameWorkerFilter.map(user => ({ text: user.name, value: user.id })),
            onFilter: (value: any, record: any) => record.userId.includes(value as string),
            sorter: (a: any, b: any) => a.name.localeCompare(b.name), // Tri alphabétique sur le nom
            render: (text: string, value: any) => <TeamCalendarButton userName={text} userId={value.userId} />,
        },
        {
            title: 'Fonction',
            dataIndex: 'workType',
            key: 'workType',
            filters: workType.map(type => ({ text: type.name, value: type.name })),
            onFilter: (value: any, record: any) => record.workType.includes(value as string),
            sorter: (a: any, b: any) => a.workType.localeCompare(b.workType), // Tri alphabétique sur le WorkType
            render: (text: string) => <p className='italic'>{text}</p>,
        },
    ];

    return defaultColumns;
}

export const setDataColumnsDaysOfWeek = (daysOfWeek: Date[]): any[] => {
    let dataColumnsToSet: any[] = [];
    daysOfWeek.map(day => {
        dataColumnsToSet.push({
            title: <p className="capitalize">{format(day, 'EEEE dd', { locale: fr })}</p>,
            dataIndex: `${format(day, 'EEEE').toLowerCase()}`,
            key: `${format(day, 'EEEE').toLowerCase()}`,
            render: (event: CustomEvent | null) => {
                return event ? (
                    EventComponentTeam({ event })
                ) : null;
            }
        });
    });
    return dataColumnsToSet;
};

export const formatTableDataParkingRessource = (
    data: ParkingPlaceResourceType[],
    daysOfWeek: Date[],
): TableParkingPropsType[] => {
    const dataFormatted = data.map((parkingPlace, index) => {
        return {
            key: index,
            name: parkingPlace.name.toUpperCase(),
            parkingPlaceId: parkingPlace.id,
            underground: parkingPlace.underground,
            chargingStation: parkingPlace.chargingStation,
            monday: setParkingPlaceByDay(parkingPlace.ParkingPlaceBooking, daysOfWeek[0]),
            tuesday: setParkingPlaceByDay(parkingPlace.ParkingPlaceBooking, daysOfWeek[1]),
            wednesday: setParkingPlaceByDay(parkingPlace.ParkingPlaceBooking, daysOfWeek[2]),
            thursday: setParkingPlaceByDay(parkingPlace.ParkingPlaceBooking, daysOfWeek[3]),
            friday: setParkingPlaceByDay(parkingPlace.ParkingPlaceBooking, daysOfWeek[4]),
        }
    });

    return dataFormatted;
};

export const setDefaultParkingColumns = (): any[] => {
    const defaultColumns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, value: any) => <TeamCalendarButton userName={text} userId={value.userId} />,
        },
        {
            title: 'Station de recharge',
            dataIndex: 'chargingStation',
            key: 'chargingStation',
            filters: [{ text: "Oui", value: true }, { text: "Non", value: false }],
            onFilter: (value: any, record: any) => record.chargingStation === value,
            render: (value: any) => <div className="flex gap-2 items-center"><p>{value ? "Oui" : "Non"}</p><FaChargingStation className={`${value ? "text-green-700" : "text-red-700"}`} /></div>,
        },
        {
            title: 'Place souterraine',
            dataIndex: 'underground',
            key: 'underground',
            filters: [{ text: "Oui", value: true }, { text: "Non", value: false }],
            onFilter: (value: any, record: any) => record.underground === value,
            render: (value: any) => <p>{value ? "Oui" : "Non"}</p>,
        },
    ];

    return defaultColumns;
}

export const setParkingPlaceByDay = (events: ParkingPlaceBookingType[], dayOfWeek: Date) => {
    const event = events.find(event => format(dayOfWeek, 'EEEE') === format(event.date, 'EEEE'));
    return event ? { ...event } : null
};

export const setDataColumnsParkingRessourcesDaysOfWeek = (daysOfWeek: Date[], userId: string, userList: UserConfigurationType[] | null): any[] => {
    let dataColumnsToSet: any[] = [];

    daysOfWeek.map(day => {
        dataColumnsToSet.push({
            title: <p className="capitalize">{format(day, 'EEEE dd', { locale: fr })}</p>,
            dataIndex: `${format(day, 'EEEE').toLowerCase()}`,
            key: `${format(day, 'EEEE').toLowerCase()}`,
            render: (event: ParkingPlaceBookingType | null) => {
                console.log(event?.userId === userId)
                return event ? (
                    <Tooltip title={event?.userId === userId ? `` : `Résérvée par ${userList?.find(user => user.id === event.userId)?.lastName.toUpperCase()} ${userList?.find(user => user.id === event.userId)?.firstName}`}>
                        <div className={`cursor-default bg-gradient-to-b ${event?.userId === userId ? "from-primary to-primary-dark" : "from-red-600 to-red-800"} w-[150px] text-white rounded-lg text-center`}>
                            {event?.userId === userId ? "Votre place" : "Place réservée"}
                        </div>
                    </Tooltip>
                ) : <div className={`cursor-default bg-gradient-to-b from-green-600 to-green-800 w-[150px] text-white rounded-lg text-center`}> Place disponible</div>;
            }
        });
    });
    return dataColumnsToSet;
};
