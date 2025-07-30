"use client"
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import Account from '~/module/account/account.component';

const ProfilePage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);

    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg max-md:flex-col bg-white gap-3">
                    <div className="flex justify-center w-[100%] max-md:w-[90%] py-2 pl-2">
                        <Account />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center mt-15 h-screen">
                    <Spin size="large" />
                </div>
            )}
        </>
    );
};

export default ProfilePage;
