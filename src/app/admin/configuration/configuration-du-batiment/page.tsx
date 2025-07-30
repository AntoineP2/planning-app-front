'use client';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import CompanyConfigurationTable from '~/module/admin/admin-configuration/buildingConfiguration/companyConfigurationTable/companyConfigurationTable.component';
import WorkTypeTable from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeTable.component';

const BuildingConfigurationPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg flex max-md:flex-col bg-white gap-3 ">
                    <button
                        onClick={() => router.back()}
                        className="absolute flex items-center justify-center top-5 left-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out text-slate-500"
                    >
                        <IoCaretBackCircleSharp size={40} />
                    </button>
                    <div className="w-[100%] max-md:w-[90%] py-2 pl-2 mt-20">
                        <CompanyConfigurationTable />
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

export default BuildingConfigurationPage;
