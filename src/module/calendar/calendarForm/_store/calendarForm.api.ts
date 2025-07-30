import axios from 'axios';
import { CreateEventDataType } from '../calendarForm.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const createEventsApi = async (eventsData: CreateEventDataType, tokenAuth: string) => {
    try {
        const query = `
        mutation CreateEvent($titleAm: String!, $titlePm: String!, $hourlyAm: String!, $hourlyPm: String!, $workTime: String!, $userId: String!, $parking: Boolean!, $date: [String!]!) {
          createEvent(createEventInput: {
            titleAm: $titleAm,
            titlePm: $titlePm,
            hourlyAm: $hourlyAm,
            hourlyPm: $hourlyPm,
            workTime: $workTime,
            userId: $userId,
            parking: $parking,
            date: $date,
          })
        }
      `;

        const variables = {
            titleAm: eventsData.titleAm,
            titlePm: eventsData.titlePm,
            hourlyAm: eventsData.hourlyAm,
            hourlyPm: eventsData.hourlyPm,
            workTime: eventsData.workTime,
            userId: eventsData.userId,
            parking: eventsData.parking,
            date: eventsData.date,
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
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getEventsExisteApi = async (userId: string, date: string[], tokenAuth: string): Promise<CustomEvent[]> => {
    try {
        const query = `
        query GetEventExiste($userId: String!, $date: [String!]!) {
            getEventExiste(getEventExisteInput : {userId: $userId, date: $date}) {
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

        const variables = { userId, date};

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
        return response.data.data.getEventExiste;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
