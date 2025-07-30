'use client';

import { Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import CalendarSample from '~/module/admin/user-configuration/calendar/calendar.component';
import CalendarForm from '~/module/admin/user-configuration/calendar/calendarForm/calendarForm.component';

const CalendarPage = () => {
    const [isHydrating, setIsHydrating] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const userName = searchParams.get('userName') || '';
    useEffect(() => {
        setIsHydrating(true);
    }, []);

    return (
        <>
            {isHydrating ? (
                <div className="relative shadow-lg w-[98%] bg-white flex flex-col justify-center items-center">
                    <h1 className="font-semibold text-xl mb-10 mt-1">Calendrier - {userName}</h1>
                    <button
                        onClick={() => router.back()}
                        className="absolute flex items-center justify-center top-5 left-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out text-slate-500"
                    >
                        <IoCaretBackCircleSharp size={40} />
                    </button>
                    <div className="w-full flex max-md:flex-col  gap-3">
                        <div className="w-[60%] max-md:w-[90%] py-2 pl-2">
                            <CalendarSample />
                        </div>
                        <div className="w-[40%] max-md:w-[90%] py-2 pl-2">
                            <CalendarForm />
                        </div>
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
