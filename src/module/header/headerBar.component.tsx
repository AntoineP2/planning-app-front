'use client';
import { Avatar } from 'antd';
import { deleteCookie, getCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdLogout } from 'react-icons/md';
import { decodeToken, isConnectedVerify } from '~/lib/utils/decodeToken';
import LogoIsb from '../../../public/logo/logo-isb.svg';
import { useAuthenticationStore } from '../authentication/_store/authentication.store';
import NavBar from './navBar.component';

const HeaderBar = () => {
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const { userFirstName, userLastName, userTrigramme, setUserData, resetUserData } = useAuthenticationStore()
    const pathName = usePathname();

    const checkToken = async () => {
        if (!getCookie('tokenAuth')) return setIsConnected(false);
        const tokenValue: string = getCookie('tokenAuth') as string;
        (await isConnectedVerify(tokenValue)) ? setIsConnected(true) : setIsConnected(false);
    };

    const decodeTokenUserData = async () => {
        const tokenValue = getCookie('tokenAuth') as string;
        const data = await decodeToken(tokenValue);
        setUserData(data);
    };

    useEffect(() => {
        checkToken();
    }, [pathName]);

    useEffect(() => {
        if (isConnected) decodeTokenUserData();
    }, [isConnected]);

    const handleLogout = () => {
        deleteCookie('tokenAuth');
        resetUserData();
        router.push('/connexion');
    };

    return (
        <>
            <div className="md:fixed md:top-0">
                <div className="relative flex items-center bg-gradient-to-r from-primary to-primary-dark text-white pl-[4%] h-14 w-screen shadow-lg shadow-slate-400">
                    <div className="flex justify-center items-center gap-9 relative h-full py-2">
                        <button>
                            <LogoIsb onClick={() => router.push('/')} />
                        </button>

                        <div className="border-r border-white h-full"></div>
                    </div>
                    <div className='pl-2'>
                        {isConnected && <NavBar />}
                    </div>
                    {isConnected && (
                        <div className="flex gap-2 justify-center items-center absolute right-[2%]">
                            <Avatar size="large" style={{ backgroundColor: '#87d068' }}>
                                <p className="uppercase font-bold cursor-default">{userTrigramme}</p>
                            </Avatar>
                            <p className="font-semibold text-sm capitalize cursor-default">
                                {userLastName} {userFirstName}
                            </p>
                            <button className="ml-2 pt-[2px]" onClick={() => handleLogout()}>
                                <MdLogout
                                    size={25}
                                    className="transition duration-150 active:scale-95 hover:text-red-500 cursor-pointer"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HeaderBar;
