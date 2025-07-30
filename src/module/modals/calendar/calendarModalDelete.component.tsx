'use client';
import { Spin } from 'antd';
import { getCookie } from 'cookies-next';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import { useCalendarStore } from '../../calendar/_store/calendar.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';

const CalendarDeleteModal = () => {
    const {
        deleteEventModal,
        eventId,
        isLoading,
        date,
        setEventId,
        setDeleteEventModal,
        setChoiceEventModal,
        deleteEvent,
        setEvents,
    } = useCalendarStore();
    const { userId } = useAuthenticationStore()

    const userToken = getCookie('tokenAuth');

    const handleCloseModal = () => {
        setEventId('');
        setDeleteEventModal(false);
    };

    const handleDeleteEvent = async () => {
        await deleteEvent(eventId, userId);
        setEventId('');
        setDeleteEventModal(false);
        setEvents(userId, date);
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${
                deleteEventModal ? 'scale-100' : 'scale-0'
            }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[30%] h-[30%] max-md:w-[90%] transition duration-300 ${
                    deleteEventModal ? 'scale-100' : 'scale-0'
                }`}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <button
                    onClick={() => setChoiceEventModal(true)}
                    className="absolute flex items-center justify-center top-5 left-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoCaretBackCircleSharp size={40} />
                </button>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="w-[400px] max-md:w-[90%] h-[200px] rounded-lg flex flex-col justify-center items-center">
                        <p className="text-lg text-center">
                            Voulez-vous supprimer cet événement ?<br />
                        </p>
                        <div className='flex max-md:flex-col max-md:gap-0 gap-5'>
                            <button
                                disabled={isLoading}
                                onClick={() => handleDeleteEvent()}
                                className="bg-gradient-to-b from-red-500 to-red-900 hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                {isLoading ? <Spin spinning={isLoading} /> : 'Oui'}
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={() => setDeleteEventModal(false)}
                                className="bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                {isLoading ? <Spin spinning={isLoading} /> : 'Annuler'}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarDeleteModal;
