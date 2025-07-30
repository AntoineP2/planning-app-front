import axios from 'axios';
import { UpdateEventDataType } from '../../calendarForm/calendarForm.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const updateEventApi = async (eventsData: UpdateEventDataType, tokenAuth: string) => {
    try {
        const query = `
        mutation UpdateEvent($id: String!, $userId: String!, $titleAm: String!, $titlePm: String!, $hourlyAm: String!, $hourlyPm: String!, $parking: Boolean! $workTime: String!) {
            updateEvent(updateEventInput: {
                id: $id,
                userId: $userId,
                titleAm: $titleAm,
                titlePm: $titlePm,
                hourlyAm: $hourlyAm,
                hourlyPm: $hourlyPm,
                workTime: $workTime,
                parking: $parking,
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
            id: eventsData.id,
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
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};

export const getParkingPlacesCountByDateApi = async (date: Date, tokenAuth: string): Promise<number> => {
    try {
        const query = `
        query GetParkingPlacesGettedCount($date: DateTime!) {
            getParkingPlacesGettedCount(date: $date)
        }
    `;

        const variables = { date };

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
        return response.data.data.getParkingPlacesGettedCount;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};
