'use client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useCalendarStore } from '~/module/admin/user-configuration/calendar/_store/calendar.store';
import CalendarCreateForm from '~/module/admin/user-configuration/calendar/calendarCreateForm/calendarCreateForm.component';
import { useCalendarUpdateFormStore } from '~/module/admin/user-configuration/calendar/calendarUpdateForm/_store/calendarUpdateForm.store';

const AdminCalendarCreateModal = () => {
    const { createEventModal, isLoading, setCreateEventModal } = useCalendarStore();
    const { event } = useCalendarUpdateFormStore();
    const [eventDate, setEventDate] = useState<string>('');

    const handleCloseModal = () => {
        setCreateEventModal(false);
    };
    useEffect(() => {
        if (event.start && createEventModal) {
            const date = format(event.start, 'yyyy-LLLL-dd-eeee', { locale: fr }).split('-');
            setEventDate(`${date[3]} ${date[2]} ${date[1]} ${date[0]}`);
        }
    }, [event, createEventModal, setCreateEventModal]);

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${createEventModal ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative  rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[60%] h-[80%] max-md:h-[90%] max-md:w-[90%] md:min-w-[900px] transition duration-300 ${createEventModal ? 'scale-100' : 'scale-0'
                    }`}
            >
                <div className="relative z-10 max-md:mb-3 ">
                    <p className="capitalize flex justify-center items-center text-2xl max-md:text-xl font-bold">
                        {eventDate}
                    </p>
                    <div className="flex justify-start w-full items center max-md:mt-4 px-2">
                        <button
                            onClick={handleCloseModal}
                            className="max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                        >
                            <IoMdCloseCircle size={40} />
                        </button>
                    </div>
                </div>
                <div className="md:relative flex justify-center items-center px-5 w-full md:mt-16">
                    <div className="min-w-[90%] max-md:w-[90%] md:h-[80%] flex flex-col justify-center items-center">
                        <CalendarCreateForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCalendarCreateModal;
