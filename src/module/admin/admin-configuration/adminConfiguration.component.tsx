'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AdminConfigurationHolidayForm from './holidayForm/holidayForm.component';
import AdminConfigurationOfficeDayForm from './officeDayForm/officeDayForm.component';
import AdminConfigurationParkingForm from './parkingForm/adminConfigurationParking.component';
import RttEmployerCase from './rtt-employer/rttEmployerCase.component';
import AdminConfigurationTimeRange from './timeRange/adminConfigurationTimeRange.component';
import AdminConfigurationUpdateDelay from './updateDelay/adminConfigurationUpdateDelay.component';
import WorkType from './workType/workType.component';
import AdminConfigurationReportPdf from './report-pdf/reportPdf';
import BuildingConfiguration from './buildingConfiguration/buildingConfiguration.component';
import ParkingPlaceConfiguration from './parkingPlaceConfiguration/parkingPlaceConfiguration.component';

const AdminConfiguration = () => {
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

    return (
        <>
            <motion.div ref={ref} variants={variantsList} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                <div className="flex flex-col justify-center items-center gap-4 max-md:ml-6 mb-5">
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationTimeRange />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationParkingForm />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationOfficeDayForm />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationUpdateDelay />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationHolidayForm />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <RttEmployerCase />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <WorkType />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <AdminConfigurationReportPdf />
                    </motion.div>
                    {/* <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <BuildingConfiguration />
                    </motion.div>
                    <motion.div variants={variantsItem} className="flex justify-center items-center w-[100%]">
                        <ParkingPlaceConfiguration />
                    </motion.div> */}
                </div>
            </motion.div>
        </>
    );
};

export default AdminConfiguration;
