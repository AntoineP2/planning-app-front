import axios from 'axios';
import { CreateEventProfileInputType, UpdateEventProfileInputType } from '../accountProfileForm.utils';
import { AccountProfileType } from '../../accountProfile.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;


export const createEventProfileApi = async (data: CreateEventProfileInputType, tokenAuth: string): Promise<AccountProfileType> => {
    try {
        const {name, hourlyAm, hourlyPm, ownerId, isPublic, parking, titleAm, titlePm, workTime} = data
        const query = `
            mutation CreateEventProfile(
                $name: String!,
                $titleAm: String!,
                $titlePm: String!,
                $hourlyAm: String!,
                $hourlyPm: String!,
                $workTime: String!,
                $isPublic: Boolean!,
                $parking: Boolean!,
                $ownerId: String!
                ) {
                createEventProfile(
                    createEventProfileInput: {
                    name: $name,
                    titleAm: $titleAm,
                    titlePm: $titlePm,
                    hourlyAm: $hourlyAm,
                    hourlyPm: $hourlyPm,
                    workTime: $workTime,
                    isPublic: $isPublic,
                    parking: $parking,
                    ownerId: $ownerId
                    }
                ) {
                    id
                    name
                    titleAm
                    titlePm
                    parking
                    hourlyAm
                    hourlyPm
                    workTime
                    isPublic
                    ownerId
                }
                }
            `;

        const variables = {
            name, hourlyAm, hourlyPm, ownerId, isPublic, titleAm, titlePm, workTime, parking
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
        return response.data.data.createEventProfile;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

export const updateEventProfileApi = async (data: UpdateEventProfileInputType, userId: string, tokenAuth: string): Promise<AccountProfileType> => {
    try {
        const {id, name, hourlyAm, hourlyPm, ownerId, isPublic, parking, titleAm, titlePm, workTime} = data
        const query = `
            mutation UpdateEventProfile(
                $id: String!,
                $name: String!,
                $titleAm: String!,
                $titlePm: String!,
                $hourlyAm: String!,
                $hourlyPm: String!,
                $workTime: String!,
                $isPublic: Boolean!,
                $parking: Boolean!,
                $ownerId: String!,
                $userId: String!
                ) {
                updateEventProfile(
                    updateEventProfileInput: {
                    id: $id,
                    name: $name,
                    titleAm: $titleAm,
                    titlePm: $titlePm,
                    hourlyAm: $hourlyAm,
                    hourlyPm: $hourlyPm,
                    workTime: $workTime,
                    isPublic: $isPublic,
                    parking: $parking,
                    ownerId: $ownerId
                    }
                    userId: $userId
                ) {
                    id
                    name
                    titleAm
                    titlePm
                    parking
                    hourlyAm
                    hourlyPm
                    workTime
                    isPublic
                    ownerId
                }
                }
            `;

        const variables = {
            id, name, hourlyAm, hourlyPm, ownerId, isPublic, titleAm, titlePm, workTime, parking, userId
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
        return response.data.data.createEventProfile;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

export const deleteEventProfileApi = async (id: string, tokenAuth: string): Promise<void> => {
    try {
        const query = `
            mutation DeleteEventProfile($id: String!) {
                deleteEventProfile(id: $id)
            }
        `;
        const variables = {
            id,
        };
        await axios.post(
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
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}