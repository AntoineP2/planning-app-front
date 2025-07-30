'use client';
import { Spin } from 'antd';
import { getCookie } from 'cookies-next';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCaretBackCircleSharp } from 'react-icons/io5';
import { useCalendarStore } from '../../calendar/_store/calendar.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';
import { useCalendarFormStore } from '~/module/calendar/calendarForm/_store/calendarForm.store';

const CalendarValidateModal = () => {
    const {validateChoicesModal, setValidateChoicesModal, setValidateChoices} = useCalendarFormStore()
    const { userId } = useAuthenticationStore()

    const userToken = getCookie('tokenAuth');

    const handleCloseModal = () => {
        setValidateChoicesModal(false);
    };

    const handleValidate = async () => {
        setValidateChoices(true)
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${
                validateChoicesModal ? 'scale-100' : 'scale-0'
            }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[30%] h-[30%] max-md:w-[90%] transition duration-300 ${
                    validateChoicesModal ? 'scale-100' : 'scale-0'
                }`}
            >
                <div className="flex justify-center items-center w-full h-full">
                    <div className="w-[400px] max-md:w-[90%] h-[200px] rounded-lg flex flex-col justify-center items-center">
                        <p className="text-lg text-center">
                        Des événements existants seront modifiés. Confirmez-vous cette action ?<br />
                        </p>
                        <div className='flex max-md:flex-col max-md:gap-0 gap-5'>
                            <button
                                onClick={() => handleValidate()}
                                className="bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => handleCloseModal()}
                                className="bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                Annuler
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarValidateModal;
