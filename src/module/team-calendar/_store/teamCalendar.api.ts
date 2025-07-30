import axios from 'axios';
import { WorkTypeType } from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeTable.utils';
import { EmployeeEventCalendarType, ParkingPlaceResourceType } from '../teamCalendar.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getAllWorkTypeApi = async (tokenAuth: string): Promise<WorkTypeType[]> => {
    try {
        const query = `
        query GetAllWorkType {
            getAllWorkType {
            id
            name
            monday
            tuesday
            wednesday
            thursday
            friday
            weeklyHour
            }
        }
    `;

        const response = await axios.post(
            API_URL,
            {
                query,
            },
            {
                headers: {
                    'secret-api': API_KEY,
                    Authorization: `Bearer ${tokenAuth}`,
                },
            }
        );
        return response.data.data.getAllWorkType;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};

export const getAllUsersWithEventApi = async (
    tokenAuth: string,
    dateList: Date[]
): Promise<EmployeeEventCalendarType[]> => {
    try {
        const query = `
        query GetAllUsersWithEvent($dateList: [DateTime!]!) {
            getAllUsersWithEvent(getAllUsersWithEventInput: { dateList: $dateList }) {
                firstName
                lastName
                id
                workTypeId
                EventCalendar {
                    id
                    start
                    end
                    hourlyAm
                    hourlyPm
                    titleAm
                    titlePm
                    parking
                    workTime
                }
            }

        }
    `;

        const variables = {
            dateList,
        };

        const response = await axios.post(
            API_URL,
            {
                query,
                variables,
            },
            {
                headers: {
                    'secret-api': API_KEY,
                    Authorization: `Bearer ${tokenAuth}`,
                },
            }
        );
        return response.data.data.getAllUsersWithEvent;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};

export const getParkingPlaceRessourceApi = async (entrepriseId: string, dateList: Date[], tokenAuth: string): Promise<ParkingPlaceResourceType[]> => {
    try {
        const query = `
            query GetParkingPlaceWithBooking($entrepriseId: String!, $dateList: [DateTime!]!) {
                getParkingPlaceWithBooking(
                getParkingPlaceWithBookingInput: {
                    entrepriseId: $entrepriseId
                    dateList: $dateList
                }
                ) {
                id
                name
                underground
                chargingStation
                entrepriseId
                ParkingPlaceBooking {
                    id
                    date
                    userId
                }
                }
            }
            `;

        const variables = {
            entrepriseId,
            dateList
        }

        const response = await axios.post(
            API_URL,
            {
                query,
                variables
            },
            {
                headers: {
                    'secret-api': API_KEY,
                    Authorization: `Bearer ${tokenAuth}`,
                },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getParkingPlaceWithBooking;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
