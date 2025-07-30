"use client"

import { useEffect } from "react"
import { Space, Table, Tooltip } from "antd"
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion';
import { IoMdAddCircle } from "react-icons/io";
import type { TableProps } from 'antd';
import { useCompanyStore } from "../../buildingConfiguration/companyConfigurationTable/_store/company.store";
import { FaChargingStation } from "react-icons/fa";
import { useParkingPlaceStore } from "../_store/parkingPlace.store";
import { ParkingPlaceTableType } from "../parkingPlace.utils";

const ParkingPlaceConfigurationTable = () => {
    const { parkingPlaceTableList, isLoading, getAllParkingPlace, setParkingPlaceSelected, setActiveModal } = useParkingPlaceStore()
    const { companyList, getAllCompany } = useCompanyStore()

    useEffect(() => {
        getAllParkingPlace()
        getAllCompany()
    }, [getAllParkingPlace, getAllCompany])

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


    const parkingPlaceTableColumns: TableProps<ParkingPlaceTableType>['columns'] = [
        {
            title: 'Numero',
            dataIndex: 'name',
            key: 'name',
            render: text => <p className="font-semibold uppercase">{text}</p>,
        },
        {
            title: 'Station de recharge',
            dataIndex: 'chargingStation',
            key: 'chargingStation',
            filters: [{ text: "Oui", value: true }, { text: "Non", value: false }],
            onFilter: (value: any, record: any) => record.chargingStation === value,
            render: state => <div className="flex gap-2 items-center"><p>{state ? "Oui" : "Non"}</p><FaChargingStation className={`${state ? "text-green-700" : "text-red-700"}`} /></div>,
        },
        {
            title: 'Place souterraine',
            dataIndex: 'underground',
            key: 'underground',
            filters: [{ text: "Oui", value: true }, { text: "Non", value: false }],
            onFilter: (value: any, record: any) => record.underground === value,
            render: state => <p>{state ? "Oui" : "Non"}</p>,
        },
        {
            title: 'Entreprise',
            dataIndex: 'entrepriseId',
            key: 'entrepriseId',
            filters: companyList.map(company => ({ text: company.name, value: company.id })),
            onFilter: (value: any, record: any) => record.entrepriseId.includes(value as string),
            render: (company) => <p className="capitalize">{companyList.find(c => c.id === company)?.name}</p>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <button onClick={() => handleOpenUpdateModal(record)} className='font-semibold text-primary hover:text-primary-light'>Modifier</button>
                    <button onClick={() => handleOpenDeleteModal(record)} className='font-semibold text-red-600 hover:text-red-500' >Supprimer</button>
                </ Space>

            ),
        },
    ]

    const handleOpenUpdateModal = (parkingPlace: ParkingPlaceTableType) => {
        setParkingPlaceSelected({
            id: parkingPlace.key ?? '',
            name: parkingPlace.name ?? '',
            chargingStation: parkingPlace.chargingStation ?? false,
            entrepriseId: parkingPlace.entrepriseId ?? '',
            underground: parkingPlace.underground ?? false,
        })
        setActiveModal('update')
    }

    const handleOpenDeleteModal = (parkingPlace: ParkingPlaceTableType) => {
        setParkingPlaceSelected({
            id: parkingPlace.key ?? '',
            name: parkingPlace.name ?? '',
            chargingStation: parkingPlace.chargingStation ?? false,
            entrepriseId: parkingPlace.entrepriseId ?? '',
            underground: parkingPlace.underground ?? false,
        })
        setActiveModal('delete')
    }


    return (
        <div>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="w-full flex flex-col justify-center items-center gap-4">
                <motion.div variants={variantsItem}>
                    <h1 className='text-2xl font-bold mb-5'>Gestion des places de parking</h1>
                </motion.div>

                <motion.div variants={variantsItem} className='w-[80%] flex justify-end items-center mr-5'>
                    <Tooltip title='Ajouter une entreprise'>
                        <button onClick={() => setActiveModal('create')} className='text-primary hover:text-primary-light active:scale-95 transition duration-150 ease-in-out'>
                            <IoMdAddCircle size={40} />
                        </button>
                    </ Tooltip>
                </motion.div>
                <motion.div variants={variantsItem} className="w-[80%] border shadow-lg">
                    {parkingPlaceTableList && <Table columns={parkingPlaceTableColumns} dataSource={parkingPlaceTableList} loading={isLoading} />}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default ParkingPlaceConfigurationTable