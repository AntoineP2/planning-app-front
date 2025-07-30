import { WorkTypeType } from '../../admin-configuration/workType/workTypeTable/workTypeTable.utils';

export type UserUpdateFormStateType = {
    isLoading: boolean;
    active: boolean;
    workTypeId: string;
    roleList: RoleType[] | [];
    userRoleList: RoleType[] | [];
    userRoleListFormatted: string[] | [];
    roleListFormatted: { label: string; value: string }[] | [];
    setUserRoleList: (UserRoleList: string[]) => void;
    getRoleList: () => Promise<void>;
    getUserRoleList: (userId: string) => Promise<void>;
    setWorkTypeId: (workTypeId: string) => void;
    setActive: (active: boolean) => void;
    updateUser: (id: string, active: boolean, workTypeId: string) => Promise<void>;
    updateUserRole: (id: string, roleIdList: string[]) => Promise<void>;
};

export type UserUpdateFormType = {
    workType: WorkTypeType;
    active: boolean;
};

export type RoleType = {
    roleId: string;
    roleName: string;
};
