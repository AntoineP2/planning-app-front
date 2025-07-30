import axios from 'axios';
import { WorkTypeType } from '../workTypeTable.utils';

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
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getAllWorkType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const createWorkTypeApi = async (
    name: string,
    weeklyHour: string,
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string,
    tokenAuth: string
): Promise<WorkTypeType> => {
    try {
        const query = `
        mutation CreateWorkType($name: String!, $monday: String!, $tuesday: String!, $wednesday: String!, $thursday: String!, $friday: String!, $weeklyHour: String!) {
            createWorkType(createWorkTypeInput :{
                name: $name
                monday: $monday
                tuesday: $tuesday
                wednesday: $wednesday
                thursday: $thursday
                friday: $friday
                weeklyHour: $weeklyHour
            }) {
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

        const variables = { name, monday, tuesday, wednesday, thursday, friday, weeklyHour };

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
        return response.data.data.createWorkType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const deleteWorkTypeApi = async (id: string, tokenAuth: string): Promise<string> => {
    try {
        const query = `
        mutation DeleteWorkType($id: String!) {
            deleteWorkType(id: $id)
        }
    `;

        const variables = { id };

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
        return response.data.data.deleteWorkType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateWorkTypeApi = async (workType: WorkTypeType, tokenAuth: string): Promise<WorkTypeType> => {
    try {
        const query = `
        mutation UpdateWorkType($id: String!, $name: String!, $monday: String!, $tuesday: String!, $wednesday: String!, $thursday: String!, $friday: String!, $weeklyHour: String!) {
            updateWorkType(updateWorkTypeInput: {
                id: $id
                name: $name
                monday: $monday
                tuesday: $tuesday
                wednesday: $wednesday
                thursday: $thursday
                friday: $friday
                weeklyHour: $weeklyHour
                }) {
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
        const { id, name, monday, thursday, tuesday, wednesday, friday, weeklyHour } = workType;
        const variables = { id, name, monday, thursday, tuesday, wednesday, friday, weeklyHour };

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
        return response.data.data.updateWorkType;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
