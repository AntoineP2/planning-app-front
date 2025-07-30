export type UserConfigurationType = {
    id: string;
    firstName: string;
    lastName: string;
    trigramme: string;
    active: boolean;
    workTypeId: string;
};

export type UserListStateType = {
    isUserListLoading: boolean;
    selectedUser: UserConfigurationType | null;
    userList: UserConfigurationType[] | null;
    getAllUsers: () => Promise<void>;
    setSelectedUser: (user: UserConfigurationType) => void;
    resetSelectedUser: () => void;
};
