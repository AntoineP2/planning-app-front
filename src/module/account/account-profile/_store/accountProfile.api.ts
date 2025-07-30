import axios from 'axios';
import { AccountProfileType } from '../accountProfile.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getAllEventProfileByUserOwnerIdApi = async (userId: string, tokenAuth: string): Promise<AccountProfileType[]> => {
    try {
        const query = `
        query GetAllEventProfileByUserOwnerId($userId: String!) {
            getAllEventProfileByUserOwnerId(userId: $userId) {
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
            userId,
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
        return response.data.data.getAllEventProfileByUserOwnerId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};