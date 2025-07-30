'use client';
import { Spin } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { IoWarning } from 'react-icons/io5';
import freeDayImage from '../../../../../public/admin-image/freeDay.png';
import { useAdminConfigurationStore } from '../_store/adminConfiguration.store';

const AdminConfigurationHolidayForm = () => {
    const { isLoadingHoliday, officeDay, updateHoliday } = useAdminConfigurationStore();
    const [choiceYear, setChoiceYear] = useState<number>(new Date().getFullYear());
    const rangeYearList: number[] = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + (i - 1));

    const onSubmitOfficeDay = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await updateHoliday(choiceYear);
    };

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={freeDayImage} alt="freeDay Image" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Jours fériés</h2>
                </div>
                <form onSubmit={onSubmitOfficeDay}>
                    <div className="flex justify-between items-center mb-3 md:px-10 max-md:px-5 mt-10">
                        <div className="w-full">
                            {isLoadingHoliday ? (
                                <div className="flex items-center gap-2 text-orange-600">
                                    {' '}
                                    <IoWarning size={20} />
                                    <span className="italic">Cette action peut prendre quelques minutes...</span>
                                    <IoWarning size={20} />
                                </div>
                            ) : (
                                <select
                                    value={choiceYear}
                                    onChange={e => setChoiceYear(parseInt(e.target.value))}
                                    className={`appearance-none bg-white outline-none border p-2 rounded-md w-1/2 shadow focus:border-blue-500 transition duration-150 ease-in-out ${isLoadingHoliday &&
                                        'cursor-not-allowed bg-slate-300 text-slate-400'} capitalize`}
                                >
                                    {rangeYearList.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoadingHoliday}
                            className={`text-white p-2 w-[140px] rounded-md shadow transition duration-150 ease-in-out ${
                                isLoadingHoliday
                                    ? 'cursor-progress bg-slate-200'
                                    : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                            }`}
                        >
                            {isLoadingHoliday ? <Spin spinning={isLoadingHoliday} /> : 'Confirmer'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminConfigurationHolidayForm;
