'use client';
import { Spin, TimePicker, Tooltip } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import timeRangeImage from '../../../../../public/admin-image/timeRange.png';
import { useAdminConfigurationStore } from '../_store/adminConfiguration.store';

const AdminConfigurationTimeRange = () => {
    const { isLoadingTimeRange, timeRange, getTimeRange, updateTimeRange } = useAdminConfigurationStore();
    const [endHour, setEndHour] = useState<number>(0);
    const [startHour, setStartHour] = useState<number>(0);
    const [timeRangeString, setTimeRangeString] = useState<string>('');
    const [isEmptyTimeRange, setIsEmptyTimeRange] = useState<boolean>(false);

    useEffect(() => {
        getTimeRange();
    }, [getTimeRange]);

    useEffect(() => {
        if (timeRange) {
            setEndHourAndStartHour(timeRange);
        }
    }, [timeRange]);

    const setEndHourAndStartHour = (timeRange: string): void => {
        const [start, end] = timeRange.split('-');
        setStartHour(parseInt(start));
        setEndHour(parseInt(end));
    };

    const onSubmitTimeRange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!timeRangeString) {
            toast.error('Veuillez choisir une plage horaire.');
            setIsEmptyTimeRange(true);
            return;
        }
        setIsEmptyTimeRange(false);
        await updateTimeRange(timeRangeString);
        await getTimeRange();
    };

    const onChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
        if (dates) {
            const dateStringTest = `${dateStrings[0]} - ${dateStrings[1]}`;
            setTimeRangeString(dateStringTest);
        }
    };

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={timeRangeImage} alt="parking" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Plages horaires de présence</h2>
                </div>
                <div className="ml-10 max-md:ml-2 mt-5">
                    <p className="italic">
                        Paramètre actuel :{' '}
                        <span className="text-primary font-semibold">
                            {isLoadingTimeRange ? 'Chargement...' : timeRange}
                        </span>
                    </p>
                </div>

                <form onSubmit={onSubmitTimeRange}>
                    <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-5">
                        <div className="flex gap-5 items-center">
                            <Tooltip title={`${isEmptyTimeRange ? 'Une plage horaire est requise' : ''}`}>
                                <TimePicker.RangePicker
                                    format="HH:mm"
                                    onChange={onChange}
                                    minuteStep={15}
                                    size="large"
                                    status={isEmptyTimeRange ? 'error' : ''}
                                />
                            </Tooltip>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoadingTimeRange}
                            className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out ${isLoadingTimeRange
                                    ? 'cursor-progress bg-slate-200'
                                    : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                                }`}
                        >
                            {isLoadingTimeRange ? <Spin spinning={isLoadingTimeRange} /> : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminConfigurationTimeRange;
