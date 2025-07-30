'use client';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useCalendarStore } from '~/module/admin/user-configuration/calendar/_store/calendar.store';
import { useCalendarUpdateFormStore } from '~/module/admin/user-configuration/calendar/calendarUpdateForm/_store/calendarUpdateForm.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';
import { presenceCase } from '~/module/calendar/calendar.utils';

const AdminCalendarChoiceModal = () => {
    const { choiceEventModal, setDeleteEventModal, setUpdateEventModal, setChoiceEventModal } = useCalendarStore();
    const { event } = useCalendarUpdateFormStore();
    const { userId } = useAuthenticationStore();
    const [isAdminDay, setIsAdminDay] = useState<boolean>(false);
    const { isBeforeThreeDays, updateDelay, getUpdateDelay, setIsBeforeThreeDays } = useAdminConfigurationStore();

    useEffect(() => {
        setIsAdminDay(false);
        if (choiceEventModal) {
            getUpdateDelay();
        }
        if (event.start && choiceEventModal) {
            setIsBeforeThreeDays(event.start);
        }
        if (event.titleAm && !presenceCase.includes(event.titleAm)) {
            setIsAdminDay(true);
        }
    }, [event, choiceEventModal, getUpdateDelay, setIsBeforeThreeDays]);

    const onCloseModal = () => {
        setChoiceEventModal(false);
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${choiceEventModal ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[30%] h-[30%] max-md:w-[90%] transition duration-300 ${choiceEventModal ? 'scale-100' : 'scale-0'
                    }`}
            >
                <button
                    onClick={onCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="w-[400px] max-md:w-[90%] h-[200px] rounded-lg flex flex-col justify-center items-center">
                        <p className="text-lg text-center">
                            Quelle action souhaitez-vous réaliser ?<br />
                        </p>
                        <div className="flex gap-5">
                            <button
                                onClick={() => setDeleteEventModal(true)}
                                className="bg-gradient-to-b from-red-500 to-red-900 hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out disabled:cursor-not-allowed"
                            >
                                Supprimer
                            </button>
                            <button
                                onClick={() => setUpdateEventModal(true)}
                                className="bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out disabled:cursor-not-allowed"
                            >
                                Modifier
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCalendarChoiceModal;
