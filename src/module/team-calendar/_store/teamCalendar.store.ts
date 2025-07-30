import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import {
    formatTableDataEvent,
    formatTableDataParkingRessource,
    setDataColumnsDaysOfWeek,
    setDataColumnsParkingRessourcesDaysOfWeek,
    setDayInterval,
    setDefaultColumns,
    setDefaultParkingColumns,
    TABLE_CHOICE_ENUM,
    TeamCalendarStateType,
    UserTeamViewType,
} from '../teamCalendar.utils';
import { getAllUsersWithEventApi, getAllWorkTypeApi, getParkingPlaceRessourceApi } from './teamCalendar.api';
import { UserConfigurationType } from '~/module/admin/user-configuration/user-list/userList.utils';

const useTeamCalendarStore = create<TeamCalendarStateType>(set => ({
    isLoading: false,
    isWorkTypeLoading: false,
    isParkingPlacesResourcesLoading: false,
    workTypeFilter: [],
    usersWithEventsList: [],
    nameWorkerFilter: [
        {
            name: '',
            id: '',
        }
    ],
    dataTableFormatted: [],
    daysOfWeek: setDayInterval(new Date()),
    dataColumns: [],
    dataParkingRessourcesColumns: [],
    dataTableParkingRessourcesFormatted: [],
    workType: [
        {
            id: '1',
            name: 'commercial',
            monday: '0',
            tuesday: '0',
            wednesday: '0',
            thursday: '0',
            friday: '0',
            weeklyHour: '0',
        },
    ],
    tableState: TABLE_CHOICE_ENUM.PLANNING,
    parkingPlacesRessources: [],

    setTableState: tableState => {
        set({ tableState });
    },
    setDaysOfWeek: date => {
        set({ daysOfWeek: setDayInterval(date) });
    },
    setUsersWithEventsList: async (dateList: Date[]) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const usersWithEventsList = await getAllUsersWithEventApi(tokenAuth, dateList);
            set({ isLoading: false, usersWithEventsList });
            set(state => {
                return {
                    dataTableFormatted: formatTableDataEvent(
                        state.usersWithEventsList,
                        state.daysOfWeek,
                        state.workType,
                        state.workTypeFilter
                    ),
                };
            });
            set(state => {
                return {
                    nameWorkerFilter: state.dataTableFormatted.map(data => { return { name: data.name, id: data.userId } }) as UserTeamViewType[],
                };
            });
            set(state => {
                return {
                    dataColumns: [
                        ...setDefaultColumns(state.nameWorkerFilter, state.workType),
                        ...setDataColumnsDaysOfWeek(state.daysOfWeek),
                    ],
                };
            });
        } catch (error) {
            set({ isLoading: true });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setWorkType: async () => {
        try {
            set({ isWorkTypeLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const workType = await getAllWorkTypeApi(tokenAuth);
            set({ workType, isWorkTypeLoading: false, workTypeFilter: workType.map(type => type.name) });
        } catch (error) {
            set({ isWorkTypeLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setWorkTypeFilter: (checked, workTypeName) => {
        set(state => {
            if (checked) {
                return {
                    workTypeFilter: [...state.workTypeFilter, workTypeName],
                };
            }
            return {
                workTypeFilter: state.workTypeFilter.filter(type => type !== workTypeName),
            };
        });
    },
    getParkingPlacesRessources: async (dateList: Date[], userId: string, userList: UserConfigurationType[] | null) => {
        try {
            set({ isLoading: true });
            // if (!process.env.NEXT_PUBLIC_ENTREPRISE_ID) {
            //     throw new Error('NEXT_PUBLIC_ENTREPRISE_ID not defined');
            // }
            // const entrepriseId = process.env.NEXT_PUBLIC_ENTREPRISE_ID;
            const entrepriseId = '1';
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const parkingPlacesRessources = await getParkingPlaceRessourceApi(entrepriseId, dateList, tokenAuth);
            set({ isParkingPlacesResourcesLoading: false, parkingPlacesRessources });
            set(state => {
                return {
                    dataTableParkingRessourcesFormatted: formatTableDataParkingRessource(
                        state.parkingPlacesRessources,
                        state.daysOfWeek,
                    ),
                };
            });
            set(state => {
                return {
                    dataParkingRessourcesColumns: [
                        ...setDefaultParkingColumns(),
                        ...setDataColumnsParkingRessourcesDaysOfWeek(state.daysOfWeek, userId, userList),
                    ],
                };
            });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
}));

export { useTeamCalendarStore };
