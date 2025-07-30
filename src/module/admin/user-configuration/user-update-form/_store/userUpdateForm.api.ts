import axios from 'axios';
import { UserConfigurationType } from '../../user-list/userList.utils';
import { RoleType } from '../userUpdateForm.utils';

if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

if (!process.env.NEXT_PUBLIC_API_KEY) {
    throw new Error('NEXT_PUBLIC_API_KEY is not defined');
}

const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY;

export const UpdateUserApi = async (
    id: string,
    active: boolean,
    workTypeId: string,
    tokenAuth: string
): Promise<UserConfigurationType[]> => {
    try {
        const query = `
        mutation UpdateUser($id: String!, $active: Boolean!, $workTypeId: String!) {
           updateUser(updateUserInput: {
            id: $id,
            active: $active,
            workTypeId: $workTypeId,
           }) {
            id
            active
            workTypeId
            }
        }
    `;

        const variables = {
            id: id,
            active: active,
            workTypeId: workTypeId,
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
        return response.data.data.updateUser;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getRoleListApi = async (tokenAuth: string): Promise<RoleType[]> => {
    try {
        const query = `
        query {
            getAllRoles {
                roleId
                roleName
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
        return response.data.data.getAllRoles;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const getRoleListByUserId = async (userId: string, tokenAuth: string): Promise<RoleType[]> => {
    try {
        const query = `
        query GetRolesByUserId($userId: String!) {
            getRolesByUserId(userId: $userId) {
                roleId
                roleName
            }
        }
    `;

        const variables = {
            userId: userId,
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
        return response.data.data.getRolesByUserId;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};

export const updateUserRoleApi = async (
    id: string,
    roleIdList: string[],
    tokenAuth: string
): Promise<UserConfigurationType[]> => {
    try {
        const query = `
        mutation UpdateUserRole($id: String!, $roleIdList: [String!]!) {
           updateUserRole(
            userId: $id,
            roleIdList: $roleIdList,
           )
        }
    `;

        const variables = {
            id: id,
            roleIdList: roleIdList,
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
        return response.data.data.updateUserRole;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
