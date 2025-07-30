'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import TeamCalendar from '~/module/team-calendar/teamCalendar.component';

const ConfigurationPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg flex max-md:flex-col bg-white gap-3 md:overflow-x-hidden overflow-x-scroll">
                    <div className="w-[100%] max-md:w-[90%] py-2 pl-2">
                        <TeamCalendar />
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

export default ConfigurationPage;
