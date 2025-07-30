'use client';
import { ConfigProvider, DatePicker, Form, Spin, Switch, Select } from 'antd';
import locale from 'antd/locale/fr_FR';
import dayjs from 'dayjs';
import 'dayjs/locale/fr-ch';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';
import { hourAmRange, hourPmRange, minutesList, verifyLunchBreakTimeIsCorrect, verifyTimeRange } from '~/lib/utils/calendarGeneral.utils';
import { useAdminConfigurationStore } from '~/module/admin/admin-configuration/_store/adminConfiguration.store';
import { useCalendarStore } from '../_store/calendar.store';
import { LocationWorkEnum, workCase } from '../calendar.utils';
import { useCalendarFormStore } from './_store/calendarForm.store';
import {
    EventDataType,
    formatData,
    HourlyCaseEnum,
    PresenceEventType
} from './calendarForm.utils';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';
import { set } from 'lodash';
import { useAccountProfileStore } from '~/module/account/account-profile/_store/accountProfile.store';

dayjs.locale('fr-ch');

const CalendarForm: React.FC = () => {
    const [form] = Form.useForm();
    const { userId } = useAuthenticationStore()
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
        validateChoicesModal,
        validateChoices,
        setValidateChoicesModal,
        setDataEvent,
        setValidateChoices,
        setSelectedDate,
        setSelectedTimeValue,
        resetData,
        createEvents,
        createAndUpdateEvents,
    } = useCalendarFormStore();
    const { isLoading: isLoadingProfil, profilesList, getProfilesList } = useAccountProfileStore()
    const { timeRange, getTimeRange } = useAdminConfigurationStore()
    const { date, setEvents } = useCalendarStore();
    const router = useRouter();
    const [titleAm, setTitleAm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [titlePm, setTitlePm] = useState<LocationWorkEnum>(LocationWorkEnum.OFFICE);
    const [parkingChoice, setParkingChoice] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const [configProfile, setConfigProfile] = useState<string>('');
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variantsList = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const variantsItem = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
    };



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
        const onlyCreate = await createEvents(eventData);
        if (!onlyCreate) {
            setValidateChoicesModal(true);
            return;
        }
        await setEvents(userId, date);
        setValue('hourlyAm', LocationWorkEnum.OFFICE);
        setValue('hourlyPm', LocationWorkEnum.OFFICE);
        setTitleAm(LocationWorkEnum.OFFICE);
        setTitlePm(LocationWorkEnum.OFFICE);
        setParkingChoice(false)
        setSelectedDate([]);
        form.resetFields();
        resetData();
    };

    const updateAndCreateEvents = useCallback(async () => {
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

        setValidateChoices(false)
        setValidateChoicesModal(false);
        await createAndUpdateEvents(eventData)
        await setEvents(userId, date);
        setValue('hourlyAm', LocationWorkEnum.OFFICE);
        setValue('hourlyPm', LocationWorkEnum.OFFICE);
        setTitleAm(LocationWorkEnum.OFFICE);
        setTitlePm(LocationWorkEnum.OFFICE);
        setParkingChoice(false)
        setSelectedDate([]);
        form.resetFields();
        resetData();
    }, [createAndUpdateEvents, date, form, hourAmEnd, hourAmStart, hourPmEnd, hourPmStart, minuteAmEnd, minuteAmStart, minutePmEnd, minutePmStart, parkingChoice, resetData, selectedDate, setEvents, setSelectedDate, setValidateChoices, setValidateChoicesModal, setValue, titleAm, titlePm, userId])

    useEffect(() => {
        if (validateChoices) {
            updateAndCreateEvents();
        }
    }, [updateAndCreateEvents, validateChoices])

    useEffect(() => {
        getTimeRange();
    }, [getTimeRange])

    useEffect(() => {
        getProfilesList(userId)
    }, [getProfilesList, userId])

    const onChange = (date: string, dateString: string | string[]) => {
        setSelectedDate(dateString as string[]);
    };

    const onChangeParkingChoice = (checked: boolean) => {
        setParkingChoice(checked);
    }

    const handleChangeProfile = (value: string) => {
        const profile = profilesList.find(profile => profile.id === value)
        if (profile) {
            setDataEvent(profile)
            setTitleAm(profile.titleAm as LocationWorkEnum)
            setTitlePm(profile.titlePm as LocationWorkEnum)
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
        <>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="w-full relative py-2 mt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col justify-center items-center gap-10">

                        <motion.div variants={variantsItem} className="md:w-[90%] w-full border shadow-lg rounded-lg px-3 ">
                            <Form form={form}>
                                <Form.Item name="selectedDate" rules={[{ required: true }]}>
                                    <ConfigProvider locale={locale}>
                                        <div className="flex justify-center mt-5 w-full">
                                            <div className="flex flex-col justify-center items-end w-full gap-3">
                                                {/* Date */}
                                                <div className="relative w-full flex items-center">
                                                    <p className="w-[50%] text-lg max-md:text-sm">Dates : </p>
                                                    <DatePicker
                                                        multiple
                                                        maxTagCount="responsive"
                                                        onChange={onChange}
                                                        defaultPickerValue={dayjs(date)}
                                                        format="DD/MM/YYYY"
                                                        className="shadow-lg max-md:text-sm"
                                                    />
                                                </div>
                                                {/* Profile selection */}
                                                <div className="relative w-full flex items-center">
                                                    <p className="w-[50%] text-lg max-md:text-sm">Pré-réglage : </p>
                                                    <Select
                                                        defaultValue=""
                                                        options={[{ label: <p>Sélectionner un profil</p>, value: "", disabled: true }, ...profilesList.map(profile => ({ label: <p className='capitalize'>{profile.name}</p>, value: profile.id }))]}
                                                        className='w-[100%] shadow-lg max-md:text-sm'
                                                        loading={isLoadingProfil}
                                                        value={configProfile}
                                                        onChange={handleChangeProfile}
                                                    />
                                                </div>
                                                {configProfile && <button type="button" onClick={handleResetConfig} className='text-primary-lightDark hover:text-primary'>Réinitialiser</button>}
                                            </div>
                                        </div>
                                    </ConfigProvider>
                                </Form.Item>
                            </Form>
                        </motion.div>

                        {/* HourlyAM */}
                        <motion.div variants={variantsItem} className="flex justify-between items-stretch md:w-[90%] w-full border shadow-lg rounded-lg">
                            <div className='flex-grow flex items-center bg-gradient-to-r from-primary-light to-primary rounded-l-lg px-5 w-[180px]'>
                                <h2 className="md:text-lg font-bold text-slate-50">Matinée</h2>
                            </div>
                            <div className="flex justify-center w-full py-2 max-md:pr-1">
                                <div className="flex justify-center">
                                    <div className="flex flex-col justify-center items-end min-w-[50%]">
                                        {/* Start */}
                                        <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                            <p className='max-md:text-sm'>Début : </p>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Heures</p>
                                            </div>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Minutes</p>
                                            </div>
                                        </div>
                                        {/* End */}
                                        <div className={`${!workCase.includes(titleAm) ? "hidden" : "flex"} items-center gap-3`}>
                                            <p className='max-md:text-sm'>Fin : </p>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Heures</p>
                                            </div>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Minutes</p>
                                            </div>
                                        </div>
                                        {/* Presence  AM*/}
                                        <div className="relative w-full flex justify-between items-center my-3">
                                            <p className="w-[50%] pr-5 max-md:text-sm">Présence : </p>
                                            <select
                                                className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center "
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
                                            {errors.titleAm?.type === 'required' && (
                                                <span className="text-red-500 text-xs">La présence est obligatoire</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>

                        {/* HourlyPM*/}
                        <motion.div variants={variantsItem} className="flex justify-between items-stretch md:w-[90%] w-full border shadow-lg rounded-lg">
                            <div className='flex-grow flex items-center bg-gradient-to-r from-primary-light to-primary rounded-l-lg px-5 w-[180px]'>
                                <h2 className="md:text-lg font-bold text-slate-50">Après-midi</h2>
                            </div>
                            <div className="flex justify-center w-full py-2 max-md:pr-1">
                                <div className="flex justify-center">
                                    <div className="flex flex-col justify-center items-end min-w-[50%]">
                                        {/* Start */}
                                        <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                            <p className='max-md:text-sm'>Début : </p>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Heures</p>
                                            </div>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border  max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Minutes</p>
                                            </div>
                                        </div>
                                        {/* End */}
                                        <div className={`${!workCase.includes(titlePm) ? "hidden" : "flex"} items-center gap-3`}>
                                            <p className='max-md:text-sm'>Fin : </p>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Heures</p>
                                            </div>
                                            <div className="flex max-md:flex-col-reverse gap-2 items-center justify-center">
                                                <select
                                                    className="bg-white border  max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center"
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
                                                <p className='max-md:hidden'>Minutes</p>
                                            </div>
                                        </div>
                                        {/* Presence  PM*/}
                                        <div className="relative w-full flex justify-between items-center my-3">
                                            <p className="w-[50%] pr-5  max-md:text-sm">Présence : </p>
                                            <select
                                                className="bg-white border max-md:text-sm rounded-lg py-3 flex justify-center items-center shadow-md text-center "
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

                        </motion.div>

                        <motion.div variants={variantsItem} className={`${titleAm === LocationWorkEnum.OFFICE || titlePm === LocationWorkEnum.OFFICE ? "" : "hidden"} flex items-center w-[90%] max-md:w-full border shadow-lg rounded-lg`}>
                            <div className=' bg-gradient-to-r from-primary-light to-primary rounded-l-lg py-3 px-5 w-[180px]'>
                                <h2 className="text-lg max-md:text-sm font-bold text-slate-50">Parking</h2>
                            </div>
                            <div className='flex justify-center w-full'>
                                <div className='flex justify-around w-full'>
                                    <p className='max-md:hidden'>Je prends une place de parking</p>
                                    <Switch onChange={onChangeParkingChoice} value={parkingChoice} />
                                </div>

                            </div>
                        </motion.div>

                        {/* Enregistrer */}
                        <motion.div variants={variantsItem} className="w-[90%] flex flex-row-reverse">
                            <button
                                className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                                disabled={isLoading || selectedDate.length === 0}
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
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </>
    );
};
export default CalendarForm;
