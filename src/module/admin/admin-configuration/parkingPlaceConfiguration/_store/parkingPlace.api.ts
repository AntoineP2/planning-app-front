import axios from 'axios';
import { ParkingPlaceType } from '../parkingPlace.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getAllParkingPlaceApi = async (tokenAuth: string): Promise<ParkingPlaceType[]> => {
    try {
        const query = `
        query GetAllParkinPlaces {
            getAllParkinPlaces {
                id
                name
                chargingStation
                underground
                entrepriseId
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
        return response.data.data.getAllParkinPlaces;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const createParkingPlaceApi = async (
    name: string,
    chargingStation: boolean,
    underground: boolean,
    entrepriseId: string,
    tokenAuth: string
): Promise<ParkingPlaceType> => {
    try {
        const query = `
        mutation CreateParkingPlace($name: String!, $chargingStation: Boolean!, $underground: Boolean!, $entrepriseId: String!) {
            createParkingPlace(createParkingPlaceInput :{
                name: $name
                chargingStation: $chargingStation
                underground: $underground
                entrepriseId: $entrepriseId
            }) {
                    id
                    name
                    chargingStation
                    underground
                    entrepriseId
                }
        }
    `;

        const variables = { name, chargingStation, underground, entrepriseId };

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
        return response.data.data.createParkingPlace;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const deleteParkingPlaceApi = async (id: string, tokenAuth: string): Promise<string> => {
    try {
        const query = `
        mutation DeleteParkingPlace($id: String!) {
            deleteParkingPlace(id: $id)
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
        return response.data.data.deleteParkingPlace;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateParkingPlaceApi = async (parkingPlace: ParkingPlaceType, tokenAuth: string): Promise<ParkingPlaceType> => {
    try {
        const query = `
        mutation UpdateParkingPlace($id: String!, $name: String!, $chargingStation: Boolean!, $underground: Boolean!, $entrepriseId: String!) {
            updateParkingPlace(updateParkingPlaceInput: {
                id: $id
                name: $name
                chargingStation: $chargingStation
                underground: $underground
                entrepriseId: $entrepriseId
                }) {
                    id
                    name
                    chargingStation
                    underground
                    entrepriseId
                    }
        }
    `;
        const { id, name, chargingStation, entrepriseId, underground } = parkingPlace;
        const variables = { id, name, chargingStation, underground, entrepriseId };

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
        return response.data.data.updateParkingPlace;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
