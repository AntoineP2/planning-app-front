import axios from 'axios';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const getConfigurationParkingPlaceApi = async (tokenAuth: string): Promise<any> => {
    try {
        const query = `
        query GetConfigurationParkingPlace {
          getConfigurationParkingPlace {
            value
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

        return response.data.data.getConfigurationParkingPlace;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getConfigurationParamsApi = async (paramsName: string, tokenAuth: string): Promise<any> => {
    try {
        const query = `
        query GetConfigurationParams($paramsName: String!) {
          getConfigurationParams(
            paramsName: $paramsName) {
            value
          }
        }
      `;

        const variables = { paramsName };
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
        return response.data.data.getConfigurationParams;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getWorkTypeByIdApi = async (workTypeId: string, tokenAuth: string): Promise<any> => {
    try {
        const query = `
        query GetWorkTypeById($workTypeId: String!) {
          getWorkTypeById(
            id: $workTypeId) {
            id
            name
            weeklyHour
          }
        }
      `;

        const variables = { workTypeId };
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
        return response.data.data.getWorkTypeById;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateAdminConfigurationApi = async (
    paramsName: string,
    value: string,
    tokenAuth: string
): Promise<any> => {
    try {
        const query = `
            mutation UpdateAdminConfiguration($value: String!, $paramsName: String!) {
            updateAdminConfiguration(updateAdminConfigurationInput: {
                value: $value,
                paramsName: $paramsName
            }) {
                id
                name
                value
            }
        }
    `;

        const variables = { value, paramsName };

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

        return response.data.data.updateAdminConfiguration;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateOrCreateHolidayApi = async (year: number, tokenAuth: string): Promise<void> => {
    try {
        const query = `
            mutation UpdateOrCreateHoliday($year: Float!) {
            updateOrCreateHoliday(
                year: $year)
        }
    `;

        const variables = { year };
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

        return response.data.data.updateOrCreateHoliday;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
