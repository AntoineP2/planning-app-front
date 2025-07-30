export type RttEmployerStateType = {
    isLoading: boolean;
    selectedDate: string[];
    selectedUserId: string[];
    setSelectedDate: (date: string[]) => void;
    setSelectedUserId: (userId: string[]) => void;
    setRttEmployerEvent: (usersId: string[], selectedDate: string[]) => Promise<void>;
};
