import axios from 'axios';
import { UserConfigurationType } from '~/module/admin/user-configuration/user-list/userList.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const setRttEmployerEventApi = async (
    selectedUserId: string[],
    selectedDate: string[],
    titleAm: string,
    tokenAuth: string
): Promise<UserConfigurationType[]> => {
    try {
        const query = `
        mutation SetRttEmployerEvent($selectedUserId: [String!]!, $selectedDate: [String!]!, $titleAm: String!) {
           setRttEmployerEvent(setRttInput: {
             usersId: $selectedUserId,
             date: $selectedDate,
             titleAm: $titleAm
            })
        }
    `;

        const variables = {
            selectedUserId,
            selectedDate,
            titleAm,
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
        return response.data.data.setRttEmployerEvent;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
};
