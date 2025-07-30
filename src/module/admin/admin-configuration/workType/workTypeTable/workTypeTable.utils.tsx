export type WorkTypeType = {
    id: string;
    name: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    weeklyHour: string;
};

export type WorkTypeTableType = {
    key: string;
    name: string;
    weeklyHour: string;
    monday?: string | undefined;
    tuesday?: string | undefined;
    wednesday?: string | undefined;
    thursday?: string | undefined;
    friday?: string | undefined;
    isDefault: boolean;
};

export type WorkTypeStateType = {
    isLoading: boolean;
    selectedWorkType: WorkTypeType;
    workTypeList: WorkTypeType[];
    workTypeListFormated: WorkTypeTableType[];
    updateWorkTypeModalFormState: boolean;
    deleteWorkTypeModalState: boolean;
    createWorkTypeModaleState: boolean;
    setCreateWorkTypeModaleState: (state: boolean) => void;
    setUpdateWorkTypeModalFormState: (state: boolean) => void;
    setDeleteWorkTypeModalState: (state: boolean) => void;
    setWorkTypeListFormated: (workTypeList: WorkTypeType[], workTypeDefault: WorkTypeType) => void;
    setWorkTypeSelected: (workType: WorkTypeType) => void;
    getWorkTypeList: () => Promise<void>;
    deleteWorkType: (id: string) => Promise<void>;
    createWorkType: (
        name: string,
        monday: string,
        tuesday: string,
        wednesday: string,
        thursday: string,
        friday: string,
        weeklyHour: string
    ) => Promise<void>;
    updateWorkType: (workType: WorkTypeType) => Promise<void>;
};

export type WorkTypeFormType = {
    name: string;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
};

export const formatWorkTypeList = (
    workTypeList: WorkTypeType[],
    workTypeDefault: WorkTypeType
): WorkTypeTableType[] => {
    return workTypeList.map(workType => ({
        key: workType.id,
        name: workType.name,
        monday: workType.monday,
        tuesday: workType.tuesday,
        wednesday: workType.wednesday,
        thursday: workType.thursday,
        friday: workType.friday,
        weeklyHour: workType.weeklyHour,
        isDefault: workType.id === workTypeDefault.id,
    }));
};
