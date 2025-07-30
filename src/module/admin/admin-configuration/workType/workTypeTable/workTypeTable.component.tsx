'use client';
import type { TableProps } from 'antd';
import { Space, Table, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { useInView } from 'react-intersection-observer';
import { useAdminConfigurationStore } from '../../_store/adminConfiguration.store';
import { useWorkTypeStore } from './_store/workTypeForm.store';
import { WorkTypeTableType } from './workTypeTable.utils';

const WorkTypeTable = () => {
    const {
        isLoading,
        workTypeList,
        selectedWorkType,
        workTypeListFormated,
        setWorkTypeListFormated,
        getWorkTypeList,
        setWorkTypeSelected,
        setDeleteWorkTypeModalState,
        setCreateWorkTypeModaleState,
        setUpdateWorkTypeModalFormState,
    } = useWorkTypeStore();
    const { workTypeDefault, isLoadingWorkTypeDefault, getWorkTypeDefault, updateWorkTypeDefault } = useAdminConfigurationStore();

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variantsList = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const variantsItem = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
    };


    const columns: TableProps<WorkTypeTableType>['columns'] = [
        {
            title: 'Fonction',
            dataIndex: 'name',
            key: 'name',
            render: text => <p className="font-semibold">{text}</p>,
        },
        {
            title: 'Heures par semaine',
            dataIndex: 'weeklyHour',
            key: 'weeklyHour',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Lundi',
            dataIndex: 'monday',
            key: 'monday',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Mardi',
            dataIndex: 'tuesday',
            key: 'tuesday',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Mercredi',
            dataIndex: 'wednesday',
            key: 'wednesday',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Jeudi',
            dataIndex: 'thursday',
            key: 'thursday',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Vendredi',
            dataIndex: 'friday',
            key: 'friday',
            render: text => <p className='text-center italic'>{text} H</p>,
        },
        {
            title: 'Fonction par défaut',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: text => <p>{text ? <span className="text-green-800 font-semibold">Profil par défaut</span> : ''}</p>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <button onClick={() => handleClickSetDefaultWorkType(record.key)} className='font-semibold text-primary hover:text-[#54d4d8]'>Défaut</button>
                    <button onClick={() => handleClickUpdateWorkType(record)} className='font-semibold text-primary hover:text-[#54d4d8]'>Modifier</button>
                    <button onClick={() => handleClickDeleteWorkType(record)} className='font-semibold text-red-600 hover:text-red-500' >Supprimer</button>
                </Space>
            ),
        },
    ];
    useEffect(() => {
        getWorkTypeList();
        getWorkTypeDefault();
    }, [getWorkTypeDefault, getWorkTypeList]);

    useEffect(() => {
        if (workTypeList && workTypeDefault) {
            setWorkTypeListFormated(workTypeList, workTypeDefault);
        }
    }, [workTypeList, workTypeDefault, setWorkTypeListFormated]);

    const handleClickSetDefaultWorkType = (workTypeId: string) => {
        updateWorkTypeDefault(workTypeId)
    }

    const handleClickDeleteWorkType = (workType: WorkTypeTableType) => {
        setWorkTypeSelected({
            id: workType.key ?? '',
            name: workType.name ?? '',
            weeklyHour: workType.weeklyHour ?? '',
            monday: workType.monday ?? '',
            tuesday: workType.tuesday ?? '',
            wednesday: workType.wednesday ?? '',
            thursday: workType.thursday ?? '',
            friday: workType.friday ?? '',
        });
        setDeleteWorkTypeModalState(true);
    };

    const handleClickUpdateWorkType = (workType: WorkTypeTableType) => {
        setWorkTypeSelected({
            id: workType.key ?? '',
            name: workType.name ?? '',
            weeklyHour: workType.weeklyHour ?? '',
            monday: workType.monday ?? '',
            tuesday: workType.tuesday ?? '',
            wednesday: workType.wednesday ?? '',
            thursday: workType.thursday ?? '',
            friday: workType.friday ?? '',
        });
        setUpdateWorkTypeModalFormState(true)
    }

    return (
        <>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="w-full flex flex-col justify-center items-center gap-4">
                <motion.div variants={variantsItem}>
                    <h1 className='text-2xl font-bold mb-5'>Gestion des fonctions</h1>
                </motion.div>

                <motion.div variants={variantsItem} className='w-[80%] flex justify-end items-center mr-5'>
                    <Tooltip title='Ajouter un profil'>
                        <button onClick={() => setCreateWorkTypeModaleState(true)} className='text-primary hover:text-primary-light active:scale-95 transition duration-150 ease-in-out'>
                            <IoMdAddCircle size={40} />
                        </button>
                    </ Tooltip>
                </motion.div>
                <motion.div variants={variantsItem} className="w-[80%] border shadow-lg">
                    {workTypeListFormated && <Table columns={columns} dataSource={workTypeListFormated} loading={isLoading || isLoadingWorkTypeDefault} />}
                </motion.div>
            </motion.div>
        </>
    );
};

export default WorkTypeTable;
