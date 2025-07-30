'use client';
import { Checkbox, ConfigProvider, DatePicker, Skeleton, Table, Tooltip } from 'antd';
import locale from 'antd/locale/fr_FR';
import { addWeeks, format, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GrFormNextLink } from 'react-icons/gr';
import { useInView } from 'react-intersection-observer';
import { useTeamCalendarStore } from './_store/teamCalendar.store';
import { TABLE_CHOICE_ENUM } from './teamCalendar.utils';
import { useAuthenticationStore } from '../authentication/_store/authentication.store';
import { useUserListStore } from '../admin/user-configuration/user-list/_store/userList.store';

const TeamCalendar = () => {
    const {
        isLoading,
        dataTableFormatted,
        daysOfWeek,
        dataColumns,
        dataTableParkingRessourcesFormatted,
        dataParkingRessourcesColumns,
        tableState,
        setTableState,
        setDaysOfWeek,
        setWorkType,
        getParkingPlacesRessources,
        setUsersWithEventsList,
    } = useTeamCalendarStore();

    const { userId } = useAuthenticationStore()

    const { userList, getAllUsers } = useUserListStore()


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
        hidden: { opacity: 0, x: 300 },
        visible: { opacity: 1, x: 0 },
    };

    useEffect(() => {
        setWorkType();
    }, [setWorkType]);

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])

    useEffect(() => {
        setUsersWithEventsList(daysOfWeek);
        // getParkingPlacesRessources(daysOfWeek, userId, userList);
    }, [daysOfWeek, setUsersWithEventsList]);

    const onChange = (date: string, dateString: string | string[]) => {
        setDaysOfWeek(date ? new Date(date) : new Date());
    };

    // const handleTableChoicePlanning = () => {
    //     setTableState(TABLE_CHOICE_ENUM.PLANNING);
    // };

    // const handleTableChoiceParking = () => {
    //     setTableState(TABLE_CHOICE_ENUM.PARKING);
    // };

    return (
        <div className="flex flex-col items-center justify-center mb-10">
            <h1 className="capitalize font-bold text-lg">
                {format(daysOfWeek[0], 'EEEE dd MMMM yyyy', { locale: fr })} -{' '}
                {format(daysOfWeek[4], 'EEEE dd MMMM yyyy', { locale: fr })}
            </h1>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="flex flex-col gap-3 mt-14 min-w-[90%]"
            >
                <motion.div variants={variantsItem} className="flex justify-between items-center">
                    <ConfigProvider locale={locale}>
                        <DatePicker picker="week" onChange={onChange} className="w-[30%] shadow-md" />
                    </ConfigProvider>
                    {/* <div className='flex gap-5'>
                        <button onClick={handleTableChoicePlanning} className={`text-lg border-primary-dark pb-1 ${tableState === TABLE_CHOICE_ENUM.PLANNING ? " text-primary-dark border-b -mb-[1px] " : ""}`}>Planning</button>
                        <button onClick={handleTableChoiceParking} className={`text-lg border-primary-dark pb-1 ${tableState === TABLE_CHOICE_ENUM.PARKING ? " text-primary-dark border-b -mb-[1px] " : ""}`}>Parking</button>
                    </div> */}
                    <div className="flex items-center gap-5">
                        <Tooltip title="Semaine précédente">
                            <button
                                onClick={() => setDaysOfWeek(subWeeks(daysOfWeek[0], 1))}
                                className="hover:text-primary active:scale-90 duration-150 transition ease-in-out"
                            >
                                <GrFormNextLink size={40} className="rotate-180" />
                            </button>
                        </Tooltip>
                        <button
                            onClick={() => setDaysOfWeek(new Date())}
                            className="hover:text-primary font-bold active:scale-95 duration-150 transition ease-in-out"
                        >
                            <span className="text-md">Aujourd&apos;hui</span>
                        </button>
                        <Tooltip title="Semaine suivante">
                            <button
                                onClick={() => setDaysOfWeek(addWeeks(daysOfWeek[0], 1))}
                                className="hover:text-primary active:scale-90 duration-150 transition ease-in-out"
                            >
                                <GrFormNextLink size={40} />
                            </button>
                        </Tooltip>
                    </div>
                </motion.div>
                {tableState === TABLE_CHOICE_ENUM.PLANNING && <motion.div variants={variantsItem}>
                    <Table
                        columns={dataColumns}
                        dataSource={dataTableFormatted}
                        pagination={false}
                        className="shadow-lg px-5 py-2 md:min-w-[1000px] pb-5"
                        loading={isLoading}
                    />
                </motion.div>}
                {/* {tableState === TABLE_CHOICE_ENUM.PARKING && <motion.div variants={variantsItem}>
                    <Table
                        columns={dataParkingRessourcesColumns}
                        dataSource={dataTableParkingRessourcesFormatted}
                        className="shadow-lg px-5 py-2 md:min-w-[1000px]"
                        loading={isLoading}
                    />
                </motion.div>} */}
            </motion.div>
        </div>
    );
};

export default TeamCalendar;
