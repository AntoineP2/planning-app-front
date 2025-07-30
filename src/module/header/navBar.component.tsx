'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthenticationStore } from '../authentication/_store/authentication.store';
import { nabBarItems, nabBarItemsAdmin } from './navBar.utils';

const NavBar = () => {
    const { userRole } = useAuthenticationStore()
    const router = useRouter();
    const pathName = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (userRole) {
            setIsAdmin(userRole.includes('admin'));
        }
    }, [userRole]);

    return (
        <div className="flex justify-start items-center w-screen h-14 gap-5 overflow-hidden">
            {nabBarItems.map(item => (
                <div
                    key={item.id}
                    className={`h-full flex justify-center items-center px-2 hover:border-b-2 hover:border-white hover:pt-[2px] transition duration-150 ease-in-out cursor-pointer group ${pathName === item.path ? 'border-b-2 border-white pt-[2px] ' : ''
                        }`}
                >
                    <button
                        onClick={() => router.push(item.path)}
                        className={`max-md:hidden text-white group-hover:text-white h-full ${pathName === item.path ? 'text-white' : ''
                            }`}
                    >
                        {item.title}
                    </button>
                    <button
                        onClick={() => router.push(item.path)}
                        className={`md:hidden text-white group-hover:text-white h-full ${pathName === item.path ? 'text-white' : ''
                            }`}
                    >
                        {item.icon}
                    </button>
                </div>
            ))}
            {isAdmin &&
                nabBarItemsAdmin.map(item => (
                    <div
                        key={item.id}
                        className={`h-full flex justify-center items-center px-2 hover:border-b-2 hover:border-white hover:pt-[2px] transition duration-150 ease-in-out cursor-pointer group ${pathName.includes(item.path) ? 'border-b-2 border-white pt-[2px] ' : ''
                            }`}
                    >
                        <button
                            onClick={() => router.push(item.path)}
                            className={`max-md:hidden text-white group-hover:text-white h-full ${pathName.includes(item.path) ? 'text-white' : ''
                                }`}
                        >
                            {item.title}
                        </button>
                        <button
                            onClick={() => router.push(item.path)}
                            className={`md:hidden text-white group-hover:text-white h-full ${pathName === item.path ? 'text-white' : ''
                                }`}
                        >
                            {item.icon}
                        </button>
                    </div>
                ))}
        </div>
    );
};

export default NavBar;
