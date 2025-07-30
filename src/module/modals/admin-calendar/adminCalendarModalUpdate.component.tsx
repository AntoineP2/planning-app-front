'use client';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import { useCalendarStore } from '~/module/admin/user-configuration/calendar/_store/calendar.store';
import { useCalendarUpdateFormStore } from '~/module/admin/user-configuration/calendar/calendarUpdateForm/_store/calendarUpdateForm.store';
import CalendarUpdateForm from '~/module/admin/user-configuration/calendar/calendarUpdateForm/calendarUpdateForm.component';

const AdminCalendarUpdateModal = () => {
    const { updateEventModal, isLoading, setUpdateEventModal, setChoiceEventModal } = useCalendarStore();
    const { event } = useCalendarUpdateFormStore();
    const [eventDate, setEventDate] = useState<string>('');

    const userToken = getCookie('tokenAuth');

    const handleCloseModal = () => {
        setUpdateEventModal(false);
    };

    useEffect(() => {
        if (event.start) {
            const date = format(event.start, 'yyyy-LLLL-dd-eeee', { locale: fr }).split('-');
            setEventDate(`${date[3]} ${date[2]} ${date[1]} ${date[0]}`);
        }
    }, [event]);

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${updateEventModal ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative  rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[60%] max-md:w-[90%] md:min-w-[900px] transition duration-300 ${updateEventModal ? 'scale-100' : 'scale-0'
                    }`}
            >
                <div className="relative z-10 max-md:mb-3 ">
                    <p className="capitalize flex justify-center items-center text-2xl max-md:text-xl font-bold">
                        {eventDate}
                    </p>
                    <div className="flex flex-row-reverse justify-between w-full items center max-md:mt-4 px-2">
                        <button
                            onClick={handleCloseModal}
                            className="max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                        >
                            <IoMdCloseCircle size={40} />
                        </button>
                        <button
                            onClick={() => setChoiceEventModal(true)}
                            className="max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                        >
                            <IoCaretBackCircleSharp size={40} />
                        </button>
                    </div>
                </div>
                <div className="md:relative flex justify-center items-center px-5 w-full md:mt-16">
                    <div className="min-w-[90%] max-md:w-[90%] md:h-[80%] flex flex-col justify-center items-center">
                        <CalendarUpdateForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCalendarUpdateModal;
