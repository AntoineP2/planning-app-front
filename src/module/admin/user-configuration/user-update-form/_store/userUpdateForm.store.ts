import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { UserUpdateFormStateType } from '../userUpdateForm.utils';
import { getRoleListApi, getRoleListByUserId, UpdateUserApi, updateUserRoleApi } from './userUpdateForm.api';

const useUserUpdateFormStore = create<UserUpdateFormStateType>(set => ({
    isLoading: false,
    active: false,
    workTypeId: '',
    roleList: [],
    userRoleList: [],
    userRoleListFormatted: [],
    roleListFormatted: [],
    setWorkTypeId: workTypeId => {
        set({ workTypeId });
    },
    setActive: active => {
        set({ active });
    },
    setUserRoleList: userRoleListFormatted => {
        set({ userRoleListFormatted });
    },
    getUserRoleList: async (userId: string) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const userRoleList = await getRoleListByUserId(userId, tokenAuth);
            if (userRoleList.length === 0) {
                set({ isLoading: false });
                set({ userRoleList: [], userRoleListFormatted: [] });
            } else {
                const userRoleListFormatted = userRoleList.map(role => role.roleId);
                set({ isLoading: false });
                set({ userRoleList, userRoleListFormatted });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    getRoleList: async () => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const roleList = await getRoleListApi(tokenAuth);
            if (roleList.length === 0) {
                set({ isLoading: false });
                set({ roleList: [], roleListFormatted: [] });
            } else {
                const roleListFormatted = roleList.map(role => {
                    return { value: role.roleId, label: role.roleName };
                });
                set({ isLoading: false });
                set({ roleList, roleListFormatted });
            }
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateUser: async (id, active, workTypeId) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await UpdateUserApi(id, active, workTypeId, tokenAuth);
            set({ isLoading: false });
            toast.success('Utilisateur mis à jour avec succès.');
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    updateUserRole: async (id, roleIdList) => {
        try {
            set({ isLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            await updateUserRoleApi(id, roleIdList, tokenAuth);
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }
}));

export { useUserUpdateFormStore };
