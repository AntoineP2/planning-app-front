'use client';
import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { presenceCase } from '~/module/calendar/calendar.utils';
import { useCalendarUpdateFormStore } from '~/module/calendar/calendarUpdateForm/_store/calendarUpdateForm.store';
import { useCalendarStore } from '../../calendar/_store/calendar.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';

const CalendarChoiceModal = () => {
    const { choiceEventModal, setDeleteEventModal, setUpdateEventModal, setChoiceEventModal } = useCalendarStore();
    const { event } = useCalendarUpdateFormStore();
    const { userId } = useAuthenticationStore()
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
                            <Tooltip
                                placement="top"
                                title={
                                    !isBeforeThreeDays
                                        ? `Il est impossible de supprimer une journée passée ou moins de ${updateDelay} jours à l'avance.`
                                        : isAdminDay
                                            ? "Il est impossible de supprimer une journée imposée par l'administration."
                                            : ''
                                }
                                arrow={true}
                            >
                                <button
                                    disabled={!isBeforeThreeDays || isAdminDay}
                                    onClick={() => setDeleteEventModal(true)}
                                    className="bg-gradient-to-b from-red-500 to-red-900 hover:bg-gradient-to-t text-white disabled:from-slate-400 disabled:to-slate-500 px-5 py-2 rounded-lg mt-5 active:scale-95 transition duration-150 min-w-[150px] ease-in-out disabled:cursor-not-allowed"
                                >
                                    Supprimer
                                </button>
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                title={
                                    !isBeforeThreeDays
                                        ? `Il est impossible de modifier une journée passée ou moins de ${updateDelay} jours à l'avance.`
                                        : isAdminDay
                                            ? "Il est impossible de modifier une journée imposée par l'administration."
                                            : ''
                                }
                                arrow={true}
                            >
                                <button
                                    disabled={!isBeforeThreeDays || isAdminDay}
                                    onClick={() => setUpdateEventModal(true)}
                                    className="bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t text-white disabled:from-slate-400 disabled:to-slate-500 px-5 py-2 rounded-lg mt-5  active:scale-95 transition duration-150 min-w-[150px] ease-in-out disabled:cursor-not-allowed"
                                >
                                    Modifier
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarChoiceModal;
