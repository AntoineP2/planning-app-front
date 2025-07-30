import axios from 'axios';
import { encodePassword } from '~/lib/utils/securePassword';
import { userDataRegisterType } from '~/lib/utils/type';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_API_URL_SSO) {
    throw new Error('NEXT_PUBLIC_API_URL_SSO is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;
const API_URL_SSO: string = process.env.NEXT_PUBLIC_API_URL_SSO;

export const getUserApi = async (email: string, password: string) => {
    try{
        const query = `
        query UserExists($email: String!, $password: String!) {
            userExists(email: $email, password: $password)
        }
        `;

        const variables = { email, password };

        const response = await axios.post(
            API_URL,
            {
                query,
                variables,
            },
            {
                headers: {
                    'secret-api': API_KEY,
                },
            }
        );

        return response.data.data.userExists;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const loginSSOGoogleApi = async () => {
    try{
        window.location.href = `${API_URL_SSO}/auth/google/login`;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

export const loginSSOMicrosoftApi = async () => {
    try{
        window.location.href = `${API_URL_SSO}/auth/microsoft/login`;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

export const registerUserApi = async (userData: userDataRegisterType) => {
    try{
        const query = `
      mutation CreateUser($firstName: String!, $lastName: String!, $trigramme: String!, $email: String!, $password: String!) {
        createUser(createUserInput: {
          firstName: $firstName,
          lastName: $lastName,
          trigramme: $trigramme,
          email: $email,
          password: $password
        }) {
            id
            firstName
            lastName
            trigramme
            email
            workTypeId
          }
      }
    `;
    const hashedPassword = await encodePassword(userData.password);

    const variables = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        trigramme: userData.trigramme.toUpperCase(),
        email: userData.email.toLowerCase(),
        password: hashedPassword,
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
            },
        }
    );

    return response.data.data.createUser;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
