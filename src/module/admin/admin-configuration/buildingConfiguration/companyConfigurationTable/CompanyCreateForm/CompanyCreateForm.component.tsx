'use client';
import { Spin } from 'antd';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCompanyStore } from '../_store/company.store';
import { CompanyFormType } from '../company.utils';
import { companyNameRegex, descriptionRegex, officeNumberRegex } from '~/lib/utils/regex.utils';

const CompanyCreateForm: React.FC = () => {
    const [companyName, setCompanyName] = useState<string>('');
    const [companyDescription, setCompanyDescription] = useState<string>('');
    const [companyOfficeNumber, setCompanyOfficeNumber] = useState<string>('');

    const [errorDescription, setErrorDescription] = useState<string>('');
    const [errorOfficeNumber, setErrorOfficeNumber] = useState<string>('');
    const [errorName, setErrorName] = useState<string>('');
    const {
        isLoading,
        createCompany,
        getAllCompany,
        getParkingPlacesCount
    } = useCompanyStore();
    const {
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormType>();

    const onSubmit: SubmitHandler<CompanyFormType> = async data => {
        await createCompany(
            companyName,
            companyDescription,
            companyOfficeNumber,
        );
        await getAllCompany();
        await getParkingPlacesCount()
    };

    const handleChangeCompanyDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (!descriptionRegex.test(value)) {
            setErrorDescription(
                "La description ne peut contenir que des lettres, chiffres, espaces et (, . ! ? - _)."
            );
        } else {
            setErrorDescription('');
        }

        setCompanyDescription(value);
    }

    const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!companyNameRegex.test(value)) {
            setErrorName(
                "Le nom de l'entreprise ne peut contenir que des lettres, chiffres, espaces, apostrophes, tirets ou points (max 50 caractères)."
            );
        } else {
            setErrorName('');
        }
        setCompanyName(value);
    }

    const handleChangeCompanyOfficeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!officeNumberRegex.test(value)) {
            setErrorOfficeNumber('Le numéro de bureau ne peut contenir que des chiffres et de lettre (max 5 caractères).');
        } else {
            setErrorOfficeNumber('');
        }
        setCompanyOfficeNumber(value)
    }

    return (
        <div className=" w-full relative py-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-3 text-sm">
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-xl font-bold pb-10 pt-2">Ajout d&apos;une entreprise</h2>

                        <div className='flex justify-center items-center w-full'>
                            <div className="flex justify-center flex-col items-center gap-5 w-full">

                                <div className="w-full ">
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col items-center px-5 w-full'>
                                            <div className='flex justify-start  w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Nom de l&apos;entreprise </p>
                                            </div>
                                            <input
                                                type="text"
                                                name="companyName"
                                                placeholder="Nom de l'entreprise"
                                                value={companyName}
                                                onChange={handleChangeCompanyName}
                                                maxLength={50}
                                                className="bg-white border md:w-[60%] w-full border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 "
                                            />
                                        </div>
                                        <div className='flex justify-center pr-3'>
                                            {errorName && <p className="text-red-500 text-sm mt-1">{errorName}</p>}
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full ">
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col items-center px-5 w-full'>
                                            <div className='flex justify-start  w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Numéro de porte </p>
                                            </div>
                                            <input
                                                type="text"
                                                name="doorNumber"
                                                placeholder="Numéro de porte (ex : A250)"
                                                value={companyOfficeNumber}
                                                onChange={handleChangeCompanyOfficeNumber}
                                                maxLength={6}
                                                className="bg-white border md:w-[60%] w-full border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 "
                                            />
                                        </div>
                                        <div className='flex justify-center pr-3'>
                                            {errorOfficeNumber && <p className="text-red-500 text-sm mt-1">{errorOfficeNumber}</p>}
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full ">
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col items-center px-5 w-full'>
                                            <div className='flex justify-start w-full md:w-[60%] md:pl-3 pb-1'>
                                                <p className="text-lg text-primary-dark">Description </p>
                                            </div>
                                            <textarea
                                                placeholder="description"
                                                value={companyDescription}
                                                onChange={e => handleChangeCompanyDescription(e)}
                                                maxLength={100}
                                                className="bg-white border md:w-[60%] w-full border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 "
                                            />
                                        </div>
                                        <div className='flex justify-center pr-3'>
                                            {errorDescription && <p className="text-red-500 text-sm mt-1">{errorDescription}</p>}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Enregistrer */}
                        <div className="flex justify-end w-full mt-10">
                            <button
                                className="px-4 py-3 shadow-lg bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:from-gray-400 disabled:to-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                                disabled={isLoading || !!errorDescription || !!errorOfficeNumber || !!errorName}
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
export default CompanyCreateForm;
