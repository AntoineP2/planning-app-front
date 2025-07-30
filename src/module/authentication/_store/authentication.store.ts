import { getCookie, setCookie } from 'cookies-next';
import { toast } from 'sonner';
import { create } from 'zustand';
import { AuthenticationStoreType } from '../authentication.utils';
import { getUserApi, loginSSOGoogleApi, loginSSOMicrosoftApi, registerUserApi } from './authentication.api';
import { decodeToken } from '~/lib/utils/decodeToken';

const useAuthenticationStore = create<AuthenticationStoreType>(set => ({
    userFirstName: '',
    userLastName: '',
    userTrigramme: '',
    userMail: '',
    userId: '',
    userRole: [],
    loading: false,
    loadingRegister: false,

    getUser: async (email: string, password: string) => {
        try {
            set({ loading: true});
            const tokenUser = await getUserApi(email.toLowerCase(), password);
            const user = await decodeToken(tokenUser);
            if (!user) {
                throw new Error('Invalid token');
            }
            set({
                loading: false,
                userFirstName: user.firstName as string,
                userLastName: user.lastName as string,
                userTrigramme: user.trigramme as string,
                userMail: user.email as string,
                userId: user.id as string,
                userRole: user.role as string[],
            })
            toast.success('Vous êtes connecté !');
            return tokenUser;
        } catch (error) {
            set({ loading: false });
            if (error instanceof Error) {
                toast.error('Identifiants incorrects !');
            }
        }
    },

    registerUser: async (userData) => {
        try {
            set({ loadingRegister: true });
            const response = await registerUserApi(userData);
            set({ loadingRegister: false });
            toast.success('Vous êtes inscrit !');
        } catch (error) {
            set({ loadingRegister: false });
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    },

    setUserData(data) {
        set({
            userFirstName: data.userFirstName,
            userLastName: data.userLastName,
            userTrigramme: data.userTrigramme,
            userMail: data.userEmail,
            userId: data.userId,
            userRole: data.userRole,
        });
    },

    loginSSOGoogle: async () => {
        try{
            await loginSSOGoogleApi();
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    },

    loginSSOMicrosoft: async () => {
        try{
            await loginSSOMicrosoftApi();
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    },

    resetUserData() {
        set({
            userFirstName: '',
            userLastName: '',
            userTrigramme: '',
            userMail: '',
            userId: '',
            userRole: [],
        });
    },
}));

export { useAuthenticationStore };
