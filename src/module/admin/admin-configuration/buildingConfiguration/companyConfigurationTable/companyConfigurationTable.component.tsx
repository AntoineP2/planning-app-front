"use client"

import { useEffect } from "react"
import { useCompanyStore } from "./_store/company.store"
import { Space, Table, Tooltip } from "antd"
import { CompanyTableType } from "./company.utils";
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion';
import { IoMdAddCircle } from "react-icons/io";
import type { TableProps } from 'antd';

const CompanyConfigurationTable = () => {
    const { companyTableList, isLoading, parkingPlacesCount, getAllCompany, getParkingPlacesCount, setIsModalDeleteVisible, setCompanySelected, setIsModalUpdateVisible, setIsModalCreateVisible } = useCompanyStore()

    useEffect(() => {
        getAllCompany()
        getParkingPlacesCount()
    }, [getAllCompany, getParkingPlacesCount])

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

    console.log(parkingPlacesCount)


    const CompanyTableColumns: TableProps<CompanyTableType>['columns'] = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: text => <p className="font-semibold capitalize">{text}</p>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: text => <p className='italic'>{text}</p>,
        },
        {
            title: 'Numéro de porte',
            dataIndex: 'officeNumber',
            key: 'officeNumber',
            render: text => <p>{text}</p>,
        },
        {
            title: 'Places de parking (total)',
            key: 'parkingPlace',
            render: (_, record) => <p>{parkingPlacesCount.find((parkingPlace) => parkingPlace.companyId === record.key)?.total}</p>,
        },
        {
            title: 'Places de parking (souterrain)',
            key: 'parkingPlaceUnderground',
            render: (_, record) => <p>{parkingPlacesCount.find((parkingPlace) => parkingPlace.companyId === record.key)?.underground}</p>,
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

    const handleOpenUpdateModal = (company: CompanyTableType) => {
        setCompanySelected({
            id: company.key ?? '',
            name: company.name ?? '',
            description: company.description ?? '',
            officeNumber: company.officeNumber ?? '',
        })
        setIsModalUpdateVisible(true)
    }

    const handleOpenDeleteModal = (company: CompanyTableType) => {
        setCompanySelected({
            id: company.key ?? '',
            name: company.name ?? '',
            description: company.description ?? '',
            officeNumber: company.officeNumber ?? '',
        })
        setIsModalDeleteVisible(true)
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
                    <h1 className='text-2xl font-bold mb-5'>Gestion des entreprises</h1>
                </motion.div>

                <motion.div variants={variantsItem} className='w-[80%] flex justify-end items-center mr-5'>
                    <Tooltip title='Ajouter une entreprise'>
                        <button onClick={() => setIsModalCreateVisible(true)} className='text-primary hover:text-primary-light active:scale-95 transition duration-150 ease-in-out'>
                            <IoMdAddCircle size={40} />
                        </button>
                    </ Tooltip>
                </motion.div>
                <motion.div variants={variantsItem} className="w-[80%] border shadow-lg">
                    {companyTableList && <Table columns={CompanyTableColumns} dataSource={companyTableList} loading={isLoading} />}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default CompanyConfigurationTable