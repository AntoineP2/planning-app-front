import axios from 'axios';
import { CompanyType, CountParkingPlacesType } from '../company.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getAllEntreprisesApi = async (tokenAuth: string): Promise<CompanyType[]> => {
    try {
        const query = `
        query GetAllEntreprises {
            getAllEntreprises {
            id
            name
            description
            officeNumber
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
        return response.data.data.getAllEntreprises;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const createEntrepriseApi = async (
    name: string,
    description: string,
    officeNumber: string,
    tokenAuth: string,
): Promise<CompanyType> => {
    try {
        const query = `
        mutation CreateEntreprise($name: String!, $description: String!, $officeNumber: String!) {
            createEntreprise(createEntrepriseInput :{
                name: $name
                description: $description
                officeNumber: $officeNumber
            }) {
                    id
                    name
                    description
                    officeNumber
                }
        }
    `;

        const variables = { name, description, officeNumber };

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
        return response.data.data.createEntreprise;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const deleteEntrepriseApi = async (id: string, tokenAuth: string): Promise<string> => {
    try {
        const query = `
        mutation DeleteEntreprise($id: String!) {
            deleteEntreprise(id: $id)
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
        return response.data.data.deleteEntreprise;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateEntrepriseApi = async (company: CompanyType, tokenAuth: string): Promise<CompanyType> => {
    try {
        const query = `
        mutation UpdateEntreprise($id: String!, $name: String!, $description: String!, $officeNumber: String!) {
            updateEntreprise(updateEntrepriseInput: {
                id: $id
                name: $name
                description: $description
                officeNumber: $officeNumber
                }) {
                    id
                    name
                    description
                    officeNumber
                    }
        }
    `;
        const { id, name, description, officeNumber } = company;
        const variables = { id, name, description, officeNumber };

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
        return response.data.data.updateEntreprise;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const countParkingPlacesByCompanyIdApi = async (tokenAuth: string): Promise<CountParkingPlacesType[]> => {
    try {
        const query = `
        mutation CountParkingPlacesByCompanyId {
            countParkingPlacesByCompanyId {
                companyId
                total
                underground
                notUnderground
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
        return response.data.data.countParkingPlacesByCompanyId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
