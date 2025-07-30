'use client';
import { Spin } from 'antd';
import Image from 'next/image';
import { useEffect } from 'react';
import officeFormImage from '../../../../../public/admin-image/officeform.png';
import { useAdminConfigurationStore } from '../_store/adminConfiguration.store';
import { ListOfWorkDays } from '../adminConfiguration.utils';

const AdminConfigurationOfficeDayForm = () => {
    const { isLoadingOfficeDay, officeDay, setOfficeDay, getOfficeDay, updateOfficeDay } = useAdminConfigurationStore();

    useEffect(() => {
        getOfficeDay();
    }, [getOfficeDay]);

    const onSubmitOfficeDay = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await updateOfficeDay(officeDay);
    };

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={officeFormImage} alt="officeWorkImage" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Jour de présence obligatoire.</h2>
                </div>
                <form onSubmit={onSubmitOfficeDay}>
                    <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-10">
                        <select
                            value={officeDay}
                            onChange={e => setOfficeDay(e.target.value)}
                            className={`appearance-none bg-white outline-none border p-2 rounded-md w-1/2 shadow focus:border-blue-500 transition duration-150 ease-in-out ${isLoadingOfficeDay &&
                                'cursor-not-allowed bg-slate-300 text-slate-400'} capitalize`}
                        >
                            {ListOfWorkDays.map((day, index) => (
                                <option key={index} value={day} className="capitalize">
                                    {day}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={isLoadingOfficeDay}
                            className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out ${isLoadingOfficeDay
                                    ? 'cursor-progress bg-slate-200'
                                    : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                                }`}
                        >
                            {isLoadingOfficeDay ? <Spin spinning={isLoadingOfficeDay} /> : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminConfigurationOfficeDayForm;
