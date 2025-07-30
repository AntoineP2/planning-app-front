'use client';
import { Select, Spin, Switch, Tooltip } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { hourAmRange, hourPmRange, minutesList, verifyLunchBreakTimeIsCorrect, verifyTimeRange } from '~/lib/utils/calendarGeneral.utils';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useCalendarStore } from '../_store/calendar.store';
import { isSameIsoDay, LocationWorkEnum, workCase } from '../calendar.utils';
import {
    EventDataType,
    formatData,
    HourlyCaseEnum,
    PresenceEventType
} from '../calendarForm/calendarForm.utils';
import { useCalendarUpdateFormStore } from './_store/calendarUpdateForm.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';
import { useAccountProfileStore } from '~/module/account/account-profile/_store/accountProfile.store';


dayjs.locale('fr-ch');

const CalendarUpdateForm: React.FC = () => {
    const { timeRange, getTimeRange } = useAdminConfigurationStore()
    const { userId } = useAuthenticationStore();
    const { updateEventModal } = useCalendarStore();
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
        parkingPlacesTaken,
        event,
        setSelectedDate,
        setParkingPlacesCountByDate,
        setSelectedTimeValue,
        resetData,
        setDataEvent,
        updateEvent,
    } = useCalendarUpdateFormStore();
    const {isLoading: isLoadingProfil, profilesList, getProfilesList} = useAccountProfileStore()
    const { parkingPlaces, officeDay, getOfficeDay, setParkingPlaces } = useAdminConfigurationStore()
    const { setEvents, setUpdateEventModal, date } = useCalendarStore();
    const [titleAm, setTitleAm] = useState<LocationWorkEnum | string>(LocationWorkEnum.OFFICE);
    const [titlePm, setTitlePm] = useState<LocationWorkEnum | string>(LocationWorkEnum.OFFICE);
    const [parkingChoice, setParkingChoice] = useState<boolean>(false);
    const [isOfficeDay, setIsOfficeDay] = useState<boolean>(false);
    const [configProfile, setConfigProfile] = useState<string>('');

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<PresenceEventType>();

    const onSubmit: SubmitHandler<PresenceEventType> = async data => {
        let parking: boolean = parkingChoice
        if (titleAm !== LocationWorkEnum.OFFICE && titlePm !== LocationWorkEnum.OFFICE) {
            parking = false
        }

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
        const { hourlyAm, hourlyPm } = eventData
        if (workCase.includes(titleAm)) {
            if (verifyTimeRange(hourlyAm, timeRange, true)) {
                toast.error('La plage horaire du matin est incorrecte.')
                return;
            }
        }
        if (workCase.includes(titlePm)) {
            if (verifyTimeRange(hourlyPm, timeRange, false)) {
                toast.error('La plage horaire de l\'après-midi est incorrecte.')
                return;
            }
        }

        if (workCase.includes(titleAm) && workCase.includes(titlePm)) {
            if (!verifyLunchBreakTimeIsCorrect(hourlyAm, hourlyPm)) {
                return;
            }
        }
        await updateEvent({ ...eventData, id: event.id });
        resetData();
        await setEvents(userId, date);
        setUpdateEventModal(false);
    };

    const onChange = (date: string, dateString: string | string[]) => {
        setSelectedDate(dateString as string[]);
    };

    const onChangeParkingChoice = (checked: boolean) => {
        setParkingChoice(checked);
    };

    useEffect(() => {
        if (updateEventModal) {
            setParkingChoice(event.parking)
            setDataEvent(event);
            getOfficeDay()
            setParkingPlacesCountByDate(event.start)
            setParkingPlaces()
            setConfigProfile("")
        }
    }, [event, setDataEvent, setValue, setParkingPlaces, setParkingPlacesCountByDate, updateEventModal, getOfficeDay]);

    useEffect(() => {
        if (updateEventModal && officeDay) {
            if (isSameIsoDay(officeDay, event.start)) {
                setIsOfficeDay(true)
            } else {
                setIsOfficeDay(false)
            }
            setTitleAm(event.titleAm);
            setTitlePm(event.titlePm);
        }
    }, [event.start, event.titleAm, event.titlePm, officeDay, updateEventModal]);

    const handleChangeProfile = (value: string) => {
        const profile = profilesList.find(profile => profile.id === value)
        if (profile) {
            setDataEvent(profile)
            if(isOfficeDay){
                if(profile.titleAm === LocationWorkEnum.HOME || profile.titlePm === LocationWorkEnum.HOME){
                    toast.info("Vous ne pouvez pas être en télétravail un jour de présence obligatoire.")
                }
                setTitleAm(LocationWorkEnum.OFFICE)
                setTitlePm(LocationWorkEnum.OFFICE)
            }else {
                setTitleAm(profile.titleAm as LocationWorkEnum)
                setTitlePm(profile.titlePm as LocationWorkEnum)
            }
            setParkingChoice(profile.parking)
            setConfigProfile(value)
        }
    }

    const handleResetConfig = () => {
        setConfigProfile('')
        setTitleAm(LocationWorkEnum.OFFICE)
        setTitlePm(LocationWorkEnum.OFFICE)
        setParkingChoice(false)
        resetData();
    }

    return (
        <div className=" w-full relative py-2">
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border shadow-lg rounded-lg px-3 bg-white py-5 mb-4">
                <div className="w-full ">
                    {/* Profile selection */}
                    <div className="relative w-full flex items-center">
                        <p className="w-[50%]">Pré-réglage : </p>
                        <Select
                            defaultValue=""
                            options={[{label: <p>Sélectionner un profil</p>, value: "", disabled: true}, ...profilesList.map(profile => ({ label: <p className='capitalize'>{profile.name}</p>, value: profile.id }))]}
                            className='w-[100%] shadow-md'
                            loading={isLoadingProfil}
                            value={configProfile}
                            onChange={handleChangeProfile}
                            />
                    </div>
                    <div className='flex justify-end items-center'>
                        {configProfile && <button  type="button" onClick={handleResetConfig} className='text-sm text-primary-lightDark hover:text-primary mt-1'>Réinitialiser</button>}
                    </div>
                    
                </div>
                    
                </div>
                <div className="flex max-md:flex-col justify-center items-center gap-3 text-sm">
                    {/* HourlyAM */}
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-lg font-bold">Matin</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col relative justify-center min-w-[80%] max-w-[90%] min-h-[180px]">
                                {/* Start */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex items-center "} gap-3`}>
                                    <p className='w-[50px]'>Début : </p>
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
                                {/* End */}
                                <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p className='w-[50px]'>Fin : </p>
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
                                {/* Presence  AM*/}
                                <div className="w-full flex items-center mt-5">
                                    <p className="w-[50%]">Présence : </p>
                                    <Tooltip title={`${isOfficeDay ? "Jour de présence obligatoire." : ""}`}>
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center disabled:bg-slate-300 disabled:text-slate-400"
                                            value={titleAm}
                                            onChange={event => setTitleAm(event.target.value as LocationWorkEnum)}

                                        >
                                            <option disabled>État de présence</option>
                                            {Object.values(LocationWorkEnum)
                                                .filter(location => !isOfficeDay || location !== LocationWorkEnum.HOME) // Filtre HOME si isOfficeDay est vrai
                                                .map((location, index) => (
                                                    <option key={index} value={location}>
                                                        {location}
                                                    </option>
                                                ))}
                                        </select>
                                    </Tooltip>
                                    {errors.titleAm?.type === 'required' && (
                                        <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HourlyPM*/}
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-lg font-bold">Après-midi</h2>
                        <div className="flex justify-center mt-5">
                            <div className="flex flex-col justify-center min-w-[80%] max-w-[90%] min-h-[180px]">
                                {/* Start */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p className='w-[50px]'>Début : </p>
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
                                {/* End */}
                                <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                    <p className='w-[50px]'>Fin : </p>
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
                                {/* Presence  PM*/}
                                <div className="relative w-full flex items-center mt-5">
                                    <p className="w-[50%]">Présence : </p>
                                    <Tooltip title={`${isOfficeDay ? "Jour de présence obligatoire." : ""}`}>
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center disabled:bg-slate-300 disabled:text-slate-400"
                                            value={titlePm}
                                            onChange={event => setTitlePm(event.target.value as LocationWorkEnum)}
                                        >
                                            <option disabled>État de présence</option>
                                            {Object.values(LocationWorkEnum)
                                                .filter(location => !isOfficeDay || location !== LocationWorkEnum.HOME) // Filtre HOME si isOfficeDay est vrai
                                                .map((location, index) => (
                                                    <option key={index} value={location}>
                                                        {location}
                                                    </option>
                                                ))}
                                        </select>
                                    </Tooltip>
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
                        <Tooltip title={`${parkingPlacesTaken >= parkingPlaces ? "Le parking est plein." : "Le parking est disponible"}`}>
                            <p className={` ${parkingPlacesTaken >= parkingPlaces ? "text-red-600" : "text-emerald-600"} font-semibold cursor-pointer`}>{parkingPlacesTaken} / {parkingPlaces}</p>
                        </Tooltip>
                    </div>
                    <div className='flex justify-between mt-5 mb-3 md:mx-[10%]'>
                        <p>Je prends une place de parking</p>
                        <Tooltip title={`${parkingPlacesTaken >= parkingPlaces ? "Le parking est plein." : ""}`}>
                            <Switch disabled={parkingPlacesTaken >= parkingPlaces} value={parkingChoice} onChange={onChangeParkingChoice} />
                        </Tooltip>
                    </div>
                </div>

                {/* Enregistrer */}
                <div className='relativew-full flex flex-row-reverse mt-6'>
                    <button
                        className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:from-slate-400 disabled:to-slate-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
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
export default CalendarUpdateForm;
