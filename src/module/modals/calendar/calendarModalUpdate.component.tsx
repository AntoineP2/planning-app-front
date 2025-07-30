'use client';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import { useCalendarStore } from '../../calendar/_store/calendar.store';
import { useCalendarUpdateFormStore } from '../../calendar/calendarUpdateForm/_store/calendarUpdateForm.store';
import CalendarUpdateForm from '../../calendar/calendarUpdateForm/calendarUpdateForm.component';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';

const CalendarUpdateModal = () => {
    const { updateEventModal, isLoading, setUpdateEventModal, setChoiceEventModal } = useCalendarStore();
    const { event } = useCalendarUpdateFormStore();
    const { userId } = useAuthenticationStore()
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
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center md:px-0 ${updateEventModal ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative  rounded-lg bg-blue-50 md:border-2 border-primary shadow- max-md:overflow-y-scroll md:pb-5 w-[60%]max-md:w-screen md:min-w-[900px] transition duration-300 ${updateEventModal ? 'scale-100' : 'scale-0'
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
                <div className="md:relative flex justify-center items-center px-5 w-full md:mt-5">
                    <div className="min-w-[90%] max-md:w-[90%] md:h-[80%] flex flex-col justify-center items-center">
                        <CalendarUpdateForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarUpdateModal;
