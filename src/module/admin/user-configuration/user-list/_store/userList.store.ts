import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { UserListStateType } from '../userList.utils';
import { getAllUsers } from './userList.api';

const useUserListStore = create<UserListStateType>(set => ({
    selectedUser: null,
    userList: null,
    isUserListLoading: false,
    resetSelectedUser: () => set({ selectedUser: null }),
    getAllUsers: async () => {
        try {
            set({ isUserListLoading: true });
            let tokenAuth = '';
            if (getCookie('tokenAuth')) tokenAuth = getCookie('tokenAuth') as string;
            const userList = await getAllUsers(tokenAuth);
            userList.sort((a, b) => {
                return a.active === b.active ? 0 : a.active ? -1 : 1;
            });
            set({ userList, isUserListLoading: false });
        } catch (error) {
            set({ isUserListLoading: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },
    setSelectedUser: user => set({ selectedUser: user }),
}));

export { useUserListStore };
