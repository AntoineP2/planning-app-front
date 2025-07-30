import axios from 'axios';
import { WorkTypeType } from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeTable.utils';
import { CustomEvent } from '../calendar.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getEventsByUserId = async (userId: string, date: string, tokenAuth: string): Promise<CustomEvent[]> => {
    try {
        const query = `
        query EventsByUserIdAndDate($userId: String!, $date: String!) {
            eventsByUserIdAndDate(userId: $userId, date: $date) {
            id
            titleAm
            titlePm
            hourlyAm
            hourlyPm
            workTime
            parking
            start
            end
            }
        }
    `;

        const variables = { userId, date };

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
        return response.data.data.eventsByUserIdAndDate;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

interface DeleteEventResponse {
    data: {
        errors?: { message: string }[];
    };
}

export const deleteEventApi = async (id: string, userId: string, tokenAuth: string): Promise<void> => {
    try {
        const query = `
        mutation DeleteEventAdmin($id: String!, $userId: String!) {
          deleteEventAdmin(deleteEventInput: {
            id: $id,
            userId: $userId,
          })
        }
      `;

        const variables = {
            id,
            userId,
        };

        const response: DeleteEventResponse = await axios.post(
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

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getWorkTypeByUserIdApi = async (id: string, tokenAuth: string): Promise<WorkTypeType> => {
    try {
        const query = `
       query GetWorkTypeByUserId($id: String!) {
            getWorkTypeByUserId(id: $id) {
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

        const variables = {
            id,
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

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getWorkTypeByUserId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
