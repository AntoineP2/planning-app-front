import axios from 'axios';
import { WorkTypeType } from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeTable.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getWorkTypeByUserIdApi = async (id: string, tokenAuth: string): Promise<WorkTypeType> => {
    try {
        const query = `
        query GetWorkTypeByUserId($id: String!) {
            getWorkTypeByUserId(id: $id) {
            name
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
        return response.data.data.getWorkTypeByUserId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
