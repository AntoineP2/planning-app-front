'use client';
import { Spin, Switch, Tooltip } from 'antd';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { hourAmRange, hourPmRange, minutesList, verifyLunchBreakTimeIsCorrect, verifyTimeRange } from '~/lib/utils/calendarGeneral.utils';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';
import { useAccountProfileFormStore } from './_store/accountProfileForm.store';
import { EventDataType, EventProfilFormType, formatData } from './accountProfileForm.utils';
import { LocationWorkEnum, workCase } from '~/module/calendar/calendar.utils';
import { HourlyCaseEnum } from '~/module/calendar/calendarForm/calendarForm.utils';
import { useAccountProfileStore } from '../_store/accountProfile.store';

const AccountProfileUpdateForm: React.FC = () => {
    const { timeRange, getTimeRange } = useAdminConfigurationStore()
    const { userId } = useAuthenticationStore()
    const {
        name,
        hourAmEnd,
        hourAmStart,
        hourPmEnd,
        hourPmStart,
        minuteAmEnd,
        minuteAmStart,
        minutePmEnd,
        minutePmStart,
        isLoading,
        updateEventProfile,
        setSelectedTimeValue,
        setDataEvent,
        setName,
        resetData,
    } = useAccountProfileFormStore();
    const { modalState, profileSelected, resetProfileSelected, setModalState, getProfilesList } = useAccountProfileStore()
    const router = useRouter();
    const [titleAm, setTitleAm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [titlePm, setTitlePm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [isOfficeDay, setIsOfficeDay] = useState<boolean>(false);
    const [parkingChoice, setParkingChoice] = useState<boolean>(false);
    const [isPublicProfile, setIsPublicProfile] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EventProfilFormType>();

    const onSubmit: SubmitHandler<EventProfilFormType> = async data => {

        let parking: boolean = parkingChoice
        if (titleAm !== LocationWorkEnum.OFFICE && titlePm !== LocationWorkEnum.OFFICE) {
            parking = false
        }
        const eventData: EventDataType = formatData({
            name,
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
            isPublic: isPublicProfile,
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
        await updateEventProfile({...eventData, id: profileSelected.id}, userId);
        await getProfilesList(userId)
        resetDataState()
        setModalState('close')
    };

    const onChangeParkingChoice = (checked: boolean) => {
        setParkingChoice(checked);
    }

    const onChangeIsPublic = (checked: boolean) => {
        setIsPublicProfile(checked);
    }

    const resetDataState = useCallback(() => {
        setValue('hourlyAm', LocationWorkEnum.OFFICE);
        setValue('hourlyPm', LocationWorkEnum.OFFICE);
        setTitleAm(LocationWorkEnum.OFFICE);
        setTitlePm(LocationWorkEnum.OFFICE);
        setIsPublicProfile(false)
        setParkingChoice(false)
        resetData();
        resetProfileSelected();
    }, [resetData, resetProfileSelected, setValue])

    useEffect(() => {
        getTimeRange()
    }, [getTimeRange])

    useEffect(() => {
        if(modalState === 'close') {
            resetDataState()
        }
    }, [modalState, profileSelected, resetDataState, resetProfileSelected])

    useEffect(() => {
        if (profileSelected.id) {
            setDataEvent(profileSelected)
            setValue('name', profileSelected.name)
            setName(profileSelected.name)
            setTitleAm(profileSelected.titleAm as LocationWorkEnum)
            setTitlePm(profileSelected.titlePm as LocationWorkEnum)
            setParkingChoice(profileSelected.parking)
            setIsPublicProfile(profileSelected.isPublic)
        }
    }, [profileSelected, setDataEvent, setName, setValue])

    return (
        <div className="w-full relative py-2 max-md:mt-6">
            <div className='flex justify-center items-center'>
                <h1 className='text-2xl font-bold pb-5'>Modifier un profil</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white w-[100%] border shadow-lg rounded-lg p-5 mb-5">
                    <h2 className="text-lg font-bold">Nom du profil</h2>
                    <div className="flex flex-col gap-1 mt-5 w-[100%]">
                        <input
                            className="bg-white border rounded-lg py-3 px-5 flex justify-start items-center shadow-md w-full focus:outline focus:outline-2 focus:outline-primary"
                            placeholder="Nom du profil"
                            {...register('name', {
                                required: true,
                                pattern: {
                                    value: /^[\p{L}0-9][\p{L}0-9\s\-_'\.,]{1,48}[\p{L}0-9]$/u,
                                    message: 'Le nom du profil doit contenir entre 3 et 50 caractères et ne peut pas commencer ou finir par un caractère spécial.',
                                },
                            })}
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                            {errors.name?.type === 'required' && (
                                <span className="text-red-500 text-md italic">Le nom du profil est obligatoire</span>
                            )}
                            {errors.name?.type === 'pattern' && (
                                <span className="text-red-500 text-md italic">{errors.name.message}</span>
                            )}
                    </div>
                </div>
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
                                    <Tooltip title={`${isOfficeDay ? "Jour de présence obligatoire." : ""}`}>
                                        <select
                                            className="bg-white border rounded-lg py-3 flex justify-center items-center shadow-md text-center disabled:bg-slate-300 disabled:text-slate-400"
                                            {...register('titleAm', { required: true })}
                                            onChange={event => setTitleAm(event.target.value as LocationWorkEnum)}
                                            value={titleAm}
                                        >
                                            <option disabled>État de présence</option>
                                            {Object.values(LocationWorkEnum).map((location, index) => (
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
                <div className={`bg-white w-[100%] border shadow-lg rounded-lg p-5 mt-5`}>
                    <h2 className="text-lg font-bold">Autres configurations</h2>
                    <div className={`${titleAm === LocationWorkEnum.OFFICE || titlePm === LocationWorkEnum.OFFICE ? "" : "hidden"} flex justify-between mt-5 mb-3 md:mx-[10%]`}>
                        <p>Je prends une place de parking</p>
                            <Switch value={parkingChoice} onChange={onChangeParkingChoice} />
                    </div>
                    {/* <div className='flex justify-between mt-5 mb-3 md:mx-[10%]'>      
                        <p>Configuration public</p>
                        <Tooltip title="Si l'option est activée, les autres utilisateurs pourront voir et utiliser votre configuration.">
                            <Switch value={isPublicProfile} onChange={onChangeIsPublic} />
                        </Tooltip>
                    </div> */}
                </div>

                {/* Submit */}
                <div className='relativew-full flex flex-row-reverse mt-6'>
                        <button
                            className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:from-slate-400 disabled:to-slate-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                            disabled={isLoading }
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
export default AccountProfileUpdateForm;
