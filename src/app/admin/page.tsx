'use client';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import AdminHome from '~/module/admin/adminHome.component';

const AdminPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg flex max-md:flex-col bg-white gap-3">
                    <div className="w-[100%] max-md:w-[90%] py-2 pl-2">
                        <AdminHome />
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

export default AdminPage;
