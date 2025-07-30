'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import CalendarSample from '~/module/calendar/calendar.component';
import CalendarForm from '~/module/calendar/calendarForm/calendarForm.component';

const CalendarPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative w-[98%] shadow-lg flex max-lg:flex-col bg-white gap-3 overflow-x-hidden">
                    <div className="w-[60%] max-lg:w-[98%] py-2 md:pl-2">
                        <CalendarSample />
                    </div>
                    <div className="w-[40%] max-lg:w-[98%] py-2 md:pl-2 max-md:flex max-md:justify-center">
                        <CalendarForm />
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

export default CalendarPage;
