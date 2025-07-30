'use client';
import { Divider } from 'antd/lib';
import { GrGoogle } from 'react-icons/gr';
import { SiMicrosoft } from 'react-icons/si';
import { useAuthenticationStore } from './_store/authentication.store';
import LoginForm from './loginForm/loginForm.component';

const Authentication = () => {
    const { loginSSOMicrosoft, loginSSOGoogle } = useAuthenticationStore();
    return (
        <>
            <div className="flex flex-col justify-center items-center gap-3 md:w-[550px] relative bg-white shadow-xl py-10 px-14 ">
                <h2 className="text-2xl font-semibold text-blue-950">Ma présence</h2>
                <LoginForm />
                <Divider style={{ borderColor: '#47b5b9' }}></Divider>
                <div className="w-full flex-col gap-2 flex py-10">
                    <button
                        onClick={loginSSOGoogle}
                        className="flex justify-center items-center gap-3 px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg cursor-pointer text-white w-full"
                    >
                        <p>Connexion avec Google</p>
                        <GrGoogle size={20} />
                    </button>
                    <button
                        onClick={loginSSOMicrosoft}
                        className="flex justify-center items-center gap-3 px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg cursor-pointer text-white w-full"
                    >
                        <p>Connexion avec Microsoft</p>
                        <SiMicrosoft size={20} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Authentication;
