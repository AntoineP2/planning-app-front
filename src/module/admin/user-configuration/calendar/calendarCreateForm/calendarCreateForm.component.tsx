'use client';
import { Spin, Switch, Tooltip } from 'antd';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { hourAmRange, hourPmRange, minutesList } from '~/lib/utils/calendarGeneral.utils';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useCalendarStore } from '../_store/calendar.store';
import { LocationWorkEnum, workCase } from '../calendar.utils';
import { useCalendarFormStore } from '../calendarForm/_store/calendarForm.store';
import {
    EventDataType,
    formatData,
    HourlyCaseEnum,
    PresenceEventType
} from '../calendarForm/calendarForm.utils';
import { useCalendarUpdateFormStore } from '../calendarUpdateForm/_store/calendarUpdateForm.store';
import { useCalendarModaleCreateForm } from './_store/calendarCreateForm.store';

dayjs.locale('fr-ch');

const CalendarCreateForm: React.FC = () => {
    const { timeRange } = useAdminConfigurationStore()
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || '';
    const {
        hourAmEnd,
        hourAmStart,
        hourPmEnd,
        hourPmStart,
        minuteAmEnd,
        minuteAmStart,
        minutePmEnd,
        minutePmStart,
        selectedDate,
        isLoading,
        setSelectedDate,
        setSelectedTimeValue,
        resetData,
        createEvents,
    } = useCalendarFormStore();
    const { newEventDate } = useCalendarModaleCreateForm()
    const { createEventModal, date, setEvents, setCreateEventModal } = useCalendarStore();
    const router = useRouter();
    const [titleAm, setTitleAm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [titlePm, setTitlePm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [parkingChoice, setParkingChoice] = useState<boolean>(false);
    const { parkingPlaces, updateDelay, setParkingPlaces } = useAdminConfigurationStore()
    const { parkingPlacesTaken, setParkingPlacesCountByDate } = useCalendarUpdateFormStore()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PresenceEventType>();

    const onSubmit: SubmitHandler<PresenceEventType> = async data => {

        let parking: boolean = parkingChoice
        if (titleAm !== LocationWorkEnum.OFFICE && titlePm !== LocationWorkEnum.OFFICE) {
            parking = false
        }
        const selectedDate = [format(newEventDate, 'dd/MM/yyyy')]
        const eventData: EventDataType = formatData({
            hourAmEnd,
            hourAmStart,
            hourPmEnd,
            hourPmStart,
            minuteAmEnd,
            minuteAmStart,
            minutePmEnd,
            minutePmStart,
            parking,
            titleAm,
            titlePm,
            userId,
            selectedDate,
        });
        await createEvents(eventData);
        await setEvents(userId, date);
        setValue('hourlyAm', LocationWorkEnum.OFFICE);
        setValue('hourlyPm', LocationWorkEnum.OFFICE);
        setTitleAm(LocationWorkEnum.OFFICE);
        setTitlePm(LocationWorkEnum.OFFICE);
        setParkingChoice(false)
        setCreateEventModal(false)
        resetData();
    };

    const onChangeParkingChoice = (checked: boolean) => {
        setParkingChoice(checked);
    }

    useEffect(() => {
        if (newEventDate && createEventModal) {
            setTitleAm(LocationWorkEnum.OFFICE);
            setTitlePm(LocationWorkEnum.OFFICE);
            setParkingPlacesCountByDate(newEventDate)
            setParkingPlaces()
        }
    }, [setValue, setParkingPlaces, setParkingPlacesCountByDate, createEventModal, newEventDate]);

    return (
        <div className="w-full relative py-2 max-md:mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                    {/* HourlyAM */}
                    <div className="w-[90%] bg-white border shadow-lg rounded-lg p-5">
                        <h2 className="text-lg font-bold">Matin</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col justify-center items-end min-w-[50%]">
                                {/* Start */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Début : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HAMS)}
                                            value={hourAmStart}
                                        >
                                            <option disabled>Heures</option>
                                            {hourAmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MAMS)}
                                            value={minuteAmStart}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* End */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Fin : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HAME)}
                                            value={hourAmEnd}
                                        >
                                            <option disabled>Heures</option>
                                            {hourAmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MAME)}
                                            value={minuteAmEnd}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* Presence  AM*/}
                                <div className="relative w-full flex justify-between items-center mt-5">
                                    <p className="w-[50%] pl-5">Présence : </p>
                                    <select
                                        className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center disabled:bg-slate-300 disabled:text-slate-400"
                                        {...register('titleAm', { required: true })}
                                        onChange={event => setTitleAm(event.target.value as LocationWorkEnum)}
                                        value={titleAm}
                                        disabled={isLoading}

                                    >
                                        <option disabled>État de présence</option>
                                        {Object.values(LocationWorkEnum).map((location, index) => (
                                            <option key={index} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.titleAm?.type === 'required' && (
                                        <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HourlyPM*/}
                    <div className="w-[90%] bg-white border shadow-lg rounded-lg p-5">
                        <h2 className="text-lg font-bold">Après-midi</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col justify-center items-end min-w-[50%] max-md:gap-5 max-md:items-center">
                                {/* Start */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Début : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HPMS)}
                                            value={hourPmStart}
                                        >
                                            <option disabled>Heures</option>
                                            {hourPmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MPMS)}
                                            value={minutePmStart}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* End */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p>Fin : </p>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.HPME)}
                                            value={hourPmEnd}
                                        >
                                            <option disabled>Heures</option>
                                            {hourPmRange.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Heures</p>
                                    </div>
                                    <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center"
                                            onChange={event => setSelectedTimeValue(event, HourlyCaseEnum.MPME)}
                                            value={minutePmEnd}
                                        >
                                            <option disabled>Minutes</option>
                                            {minutesList.map(hour => (
                                                <option key={hour} value={hour}>
                                                    {hour}
                                                </option>
                                            ))}
                                        </select>
                                        <p>Minutes</p>
                                    </div>
                                </div>
                                {/* Presence  PM*/}
                                <div className="relative w-full flex justify-between items-center mt-5">
                                    <p className="w-[50%] pl-5">Présence : </p>
                                    <select
                                        className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center disabled:bg-slate-300 disabled:text-slate-400"
                                        {...register('titlePm', { required: true })}
                                        onChange={event => setTitlePm(event.target.value as LocationWorkEnum)}
                                        value={titlePm}
                                        disabled={isLoading}
                                    >
                                        <option disabled>État de présence</option>
                                        {Object.values(LocationWorkEnum).map((location, index) => (
                                            <option key={index} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.titlePm?.type === 'required' && (
                                        <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={`${titleAm === LocationWorkEnum.OFFICE || titlePm === LocationWorkEnum.OFFICE ? "" : "hidden"} bg-white w-[100%] border shadow-lg rounded-lg p-5 mt-5`}>
                    <h2 className="text-lg font-bold">Parking</h2>
                    <div className='flex justify-between mt-5 mb-3 md:mx-[10%]'>
                        <p>Place de parking :</p>
                        <Tooltip title={`${parkingPlacesTaken >= parkingPlaces ? "Le parking est plein" : "Le parking est disponible"}`}>
                            <p className={` ${parkingPlacesTaken >= parkingPlaces ? "text-red-600" : "text-emerald-600"} font-semibold cursor-pointer`}>{parkingPlacesTaken} / {parkingPlaces}</p>
                        </Tooltip>
                    </div>
                    <div className='flex justify-between mt-5 mb-3 md:mx-[10%]'>
                        <p>Je prends une place de parking</p>
                        <Tooltip title={`${parkingPlacesTaken >= parkingPlaces ? "Le parking est plein" : ""}`}>
                            <Switch disabled={parkingPlacesTaken >= parkingPlaces} value={parkingChoice} onChange={onChangeParkingChoice} />
                        </Tooltip>
                    </div>
                </div>

                {/* Submit */}
                <div className='relativew-full flex flex-row-reverse mt-6'>
                    <button
                        className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                        disabled={isLoading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {' '}
                        {isLoading ? (
                            <Spin spinning={isLoading} />
                        ) : (
                            <div className="flex justify-center items-center gap-3 text-white">
                                <p className="text-sm">Enregistrer</p>
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default CalendarCreateForm;
