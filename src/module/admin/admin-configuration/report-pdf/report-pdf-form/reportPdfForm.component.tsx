'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useUserListStore } from '~/module/admin/user-configuration/user-list/_store/userList.store';
import { useEffect, useState } from 'react';
import { DatePicker, Form, Select, Spin, Switch, Tooltip } from 'antd';
import { set } from 'lodash';
import { useReportPdfFormStore } from './_store/reportPdfForm.store';
import { se } from 'date-fns/locale';
import { generateExcel, generatePdf, ReportDataType, ReportPdfFormStateType } from './reportPdfForm.utils';
import { tree } from 'next/dist/build/templates/app-page';
import { LoadingOutlined } from '@ant-design/icons'

const ReportPdfForm = () => {
    const [form] = Form.useForm();
    const { userList, getAllUsers } = useUserListStore();
    const [isPdfSelected, setIsPdfSelected] = useState<boolean>(false);
    const [isExcelSelected, setIsExcelSelected] = useState<boolean>(false);
    const { selectedUsersId, isLoading, reportPresenceData, selectedDates, resetPresenceData, setSelectedDates, setSelectedUsersId, getReportPresenceData} = useReportPdfFormStore()
    const [userListFormated, setUserListFormated] = useState([{
        label: '',
        value: ''
    }]);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const [ selectedDatesGenerate, setSelectedDatesGenerate ] = useState<string[]>([]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers])

    useEffect(() => {
        if(userList) {
            const userListFormatedToSet = userList.filter(user => user.active).map(user => {
                return {
                    label: `${user.firstName} ${user.lastName}`,
                    value: user.id
                }
            })
            setUserListFormated(userListFormatedToSet);
        }
    }, [userList])

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

    const handleChangeSelectedUsers = (value: string | string[]) => {
        setSelectedUsersId(value as string[]);
    };


    const handleGenerateData = async () => {
        await getReportPresenceData(selectedUsersId, selectedDates);
        setSelectedDatesGenerate(selectedDates);
        setSelectedDates([]);
        setSelectedUsersId([]);
        form.resetFields();
    }


    const handleDownload = async () => {
        if(isPdfSelected) await generatePdf(reportPresenceData, selectedDatesGenerate);
        if(isExcelSelected) await generateExcel(reportPresenceData, selectedDatesGenerate);
        setIsExcelSelected(false);
        setIsPdfSelected(false);
        resetPresenceData();

    }
    

    const handleChangeSelectedDates: any = (date: string[], dateString: string[]) => {
        setSelectedDates(dateString);
    };

    const onChangeIsPdfFormat = (checked: boolean) => {
        setIsPdfSelected(checked);
    };

    const onChangeIsExcelFormat = (checked: boolean) => {
        setIsExcelSelected(checked);
    };

    

    return (
        <>
            <Form form={form}>
                <motion.div
                    ref={ref}
                    variants={variantsList}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="w-[100%] flex items-center md:justify-center flex-col gap-5"
                >   
                
                    <motion.div variants={variantsItem} className="md:w-[70%] w-[100%] shadow-lg border max-md:ml-5 bg-gradient-to-r from-primary to-primary-dark text-white cursor-default">
                        <div className='flex justify-center items-center w-full text-2xl my-1'>
                            <h1>
                                Rapport de présence 
                            </h1>
                        </div>
                    </motion.div>
                    <motion.div variants={variantsItem} className="md:w-[70%] w-[100%] shadow-xl border  max-md:ml-5">
                        <div className='flex flex-col justify-center items-center mx-5 my-5 gap-5'>
                            <div className='md:w-[70%] w-[100%]'>
                                <div className='flex justify-start w-full ml-3 mb-1 cursor-default'>
                                    <p>
                                        Choix des collaborateurs
                                    </p>
                                </div>
                                {userListFormated && 
                                <Form.Item name="users" >
                                    <Select
                                    mode="multiple"
                                    size="middle"
                                    placeholder="Sélection des utilisateurs"
                                    onChange={handleChangeSelectedUsers}
                                    style={{ width: '100%'}}
                                    options={userListFormated}
                                    /> 
                                </Form.Item>
                                }
                            </div>
                            <div className='md:w-[70%] w-[100%] '>
                                <div className='flex justify-start w-full ml-3 mb-1 cursor-default'>
                                    <p>
                                        Définir la période du rapport
                                    </p>
                                </div>
                                <Form.Item name="dates">
                                    <DatePicker.RangePicker style={{ width: '100%'}} onChange={handleChangeSelectedDates} placeholder={["Début de période", "Fin de période"]} format="DD/MM/YYYY" />
                                </ Form.Item>
                            </div>

                            <div className='flex justify-between items-center md:w-[70%] w-[100%]  font-semibold'>
                                <p>Télécharger le rapport en PDF</p>
                                <Tooltip title={reportPresenceData.length === 0 ? "Les données doivent être générées" : ""} placement='top'>
                                    <Switch value={isPdfSelected} disabled={reportPresenceData.length === 0} onChange={onChangeIsPdfFormat} />
                                </Tooltip>
                            </div>
                            <div className='flex justify-between items-center md:w-[70%] w-[100%] font-semibold'>
                                <p>Télécharger le rapport en Excel</p>
                                <Tooltip title={reportPresenceData.length === 0 ? "Les données doivent être générées" : ""} placement='top'>
                                    <Switch value={isExcelSelected} disabled={reportPresenceData.length === 0} onChange={onChangeIsExcelFormat} />
                                </Tooltip>
                            </div>
                            <Tooltip title={selectedDates.length === 0 || selectedUsersId.length === 0 ? reportPresenceData.length === 0 ? "Veuillez renseigner les champs ci-dessus" : "" : ""} placement='top'>
                                <button onClick={handleGenerateData} disabled={selectedDates.length === 0 || selectedUsersId.length === 0 || isLoading} className={`${isLoading ? "bg-orange-400 cursor-wait": reportPresenceData.length === 0 ? "bg-red-500" :  "bg-green-500 cursor-default"} ${selectedDates.length === 0 || selectedUsersId.length === 0 ? reportPresenceData.length === 0 ? "cursor-not-allowed" : "cursor-default" : "cursor-pointer  active:scale-95"}  transition duration-150 ease-in-out rounded-lg shadow-lg py-1 px-2 mt-5 w-[200px]`}>
                                    <p className='text-lg font-bold text-white text-center'>{isLoading ? <Spin indicator={<LoadingOutlined style={{ color: '#FFF' }} spin />} size='large' /> : reportPresenceData.length === 0 ? "Donnée non générée" :  "Données générées "}</p>
                                </button>
                            </Tooltip>
                            <div className='flex justify-end items-center md:w-[70%] w-[100%] gap-3 mt-10'>
                                <Tooltip title={reportPresenceData.length === 0 ? "Les données n'ont pas été générer" : !isExcelSelected && !isPdfSelected ? "Vous devez sélectionner au moins un format" : ""} placement='top'>
                                    <button type='button' onClick={handleDownload} disabled={reportPresenceData.length === 0 || (!isExcelSelected && !isPdfSelected)} className={`text-white p-2 w-[180px] rounded-md shadow transition duration-150 ease-in-out ${
                                            isLoading
                                                ? 'cursor-progress bg-slate-200'
                                                : 'bg-primary hover:bg-[#51cfd3] active:scale-95'
                                        } disabled:bg-slate-200 disabled:cursor-not-allowed` }> Télécharger les documents
                                    </button>
                                </Tooltip>

                            </div>
                            
                        </div>
                    </motion.div>
                
                </motion.div>
            </Form>
        </>
    );
};

export default ReportPdfForm;
