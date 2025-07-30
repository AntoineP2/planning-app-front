'use client';
import { Select, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ParkingPlaceNumberRegex } from '~/lib/utils/regex.utils';
import { useCompanyStore } from '../../../buildingConfiguration/companyConfigurationTable/_store/company.store';
import { ParkingPlaceFormType } from '../../parkingPlace.utils';
import { useParkingPlaceStore } from '../../_store/parkingPlace.store';

const ParkingPlaceCreateForm: React.FC = () => {
    const [parkingPlaceName, setParkingPlaceName] = useState<string>('');
    const [companyId, setCompanyId] = useState<string>('');
    const [isChargingStation, setIsChargingStation] = useState<boolean>(false);
    const [isUnderground, setIsUnderground] = useState<boolean>(false);

    const [errorParkingPlaceName, setErrorParkingPlaceName] = useState<string>('');
    const {
        companyList,
        getAllCompany,
    } = useCompanyStore();

    const { isLoading, createParkingPlace, getAllParkingPlace } = useParkingPlaceStore()
    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ParkingPlaceFormType>();

    const onSubmit: SubmitHandler<ParkingPlaceFormType> = async data => {
        await createParkingPlace({
            name: parkingPlaceName,
            chargingStation: isChargingStation,
            underground: isUnderground,
            entrepriseId: companyId,

        });
        getAllParkingPlace();
    };

    useEffect(() => {
        getAllCompany();
    }, [getAllCompany]);


    const handleChangeParkingPlaceNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!ParkingPlaceNumberRegex.test(value)) {
            setErrorParkingPlaceName('Le numéro de place ne peut contenir que des chiffres et de lettre (max 5 caractères).');
        } else {
            setErrorParkingPlaceName('');
        }
        setParkingPlaceName(value)
    }

    const onChangeChargingStation = (checked: boolean) => {
        setIsChargingStation(checked);
    };

    const onChangeUnderground = (checked: boolean) => {
        setIsUnderground(checked);
    };

    const handleChangeCompanyId = (companyId: string) => {
        setCompanyId(companyId);
    }

    return (
        <div className=" w-full relative py-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-3 text-sm">
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-xl font-bold pb-10 pt-2">Créer une place de Parking</h2>

                        <div className='flex justify-center items-center w-full'>
                            <div className="flex justify-center flex-col items-center gap-5 w-full">

                                <div className="w-full ">
                                    <div className='flex flex-col justify-center items-center gap-2'>
                                        <div className='flex justify-between items-center px-5 md:w-[60%] w-[100%]'>
                                            <div className='flex justify-start  w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Nom de l&apos;entreprise </p>
                                            </div>
                                            <input
                                                type="text"
                                                name="companyName"
                                                placeholder="Nom de l'entreprise"
                                                value={parkingPlaceName}
                                                onChange={handleChangeParkingPlaceNumber}
                                                maxLength={50}
                                                className="bg-white border md:w-[60%] w-full border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 "
                                            />
                                        </div>
                                        <div className='flex justify-center pr-3'>
                                            {errorParkingPlaceName && <p className="text-red-500 text-sm mt-1">{errorParkingPlaceName}</p>}
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full ">
                                    <div className='flex flex-col justify-center items-center gap-2'>
                                        <div className='flex justify-between items-center px-5 md:w-[60%] w-[100%]'>
                                            <div className='flex justify-start  w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Station de charge </p>
                                            </div>
                                            <Switch value={isChargingStation} onChange={onChangeChargingStation} />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full ">
                                    <div className='flex flex-col justify-center items-center gap-2'>
                                        <div className='flex justify-between items-center px-5 md:w-[60%] w-[100%]'>
                                            <div className='flex justify-start w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Sous sol </p>
                                            </div>
                                            <Switch value={isUnderground} onChange={onChangeUnderground} />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full ">
                                    <div className='flex flex-col justify-center items-center gap-2'>
                                        <div className='flex justify-between items-center px-5 md:w-[60%] w-[100%]'>
                                            <div className='flex justify-start w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Entreprise </p>
                                            </div>
                                            {companyList && (
                                                <Select value={companyId} style={{ width: 150 }} onChange={handleChangeCompanyId} options={companyList.map(company => ({
                                                    label: company.name.toLowerCase(),
                                                    value: company.id,
                                                }))} />)}
                                        </div>
                                    </div>
                                </div>



                            </div>
                        </div>
                        {/* Enregistrer */}
                        <div className="flex justify-end w-full mt-10">
                            <button
                                className="px-4 py-3 shadow-lg bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:from-gray-400 disabled:to-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                                disabled={isLoading || !!errorParkingPlaceName}
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
                    </div>
                </div>
            </form>
        </div>
    );
};
export default ParkingPlaceCreateForm;
