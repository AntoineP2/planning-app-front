import { userDataRegisterType } from "~/lib/utils/type";

export type AuthenticationStoreType = {
    userFirstName: string;
    userLastName: string;
    userTrigramme: string;
    userMail: string;
    userId: string;
    userRole: string[];
    loadingRegister: boolean;
    loading: boolean;
    getUser: (email: string, password: string) => Promise<void>;
    registerUser: (userData: userDataRegisterType) => Promise<void>;
    setUserData: (data: any) => void;
    resetUserData: () => void;
    loginSSOGoogle: () => Promise<void>;
    loginSSOMicrosoft: () => Promise<void>;
};