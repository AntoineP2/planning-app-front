'use client';
import { Spin } from 'antd';
import Image from 'next/image';
import { useEffect } from 'react';
import delayImage from '../../../../../public/admin-image/delay.png';
import { useAdminConfigurationStore } from '../_store/adminConfiguration.store';

const AdminConfigurationUpdateDelay = () => {
    const {
        isLoadingUpdateDelay,
        updateDelay,
        setUpdateDelay,
        getUpdateDelay,
        updateUpdateDelay,
    } = useAdminConfigurationStore();

    const onChangeParkingPlaces = (value: string) => {
        setUpdateDelay(value);
    };

    useEffect(() => {
        getUpdateDelay();
    }, [getUpdateDelay]);

    const onSubmitParkingPlaces = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await updateUpdateDelay(updateDelay);
    };

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={delayImage} alt="parking" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Délai pour créer ou modifier un événement</h2>
                </div>
                <form onSubmit={onSubmitParkingPlaces}>
                    <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-10">
                        <input
                            type="number"
                            value={updateDelay}
                            min={0}
                            max={10}
                            disabled={isLoadingUpdateDelay}
                            onChange={e => onChangeParkingPlaces(e.target.value)}
                            className={`appearance-none outline-none border p-2 rounded-md w-1/2 shadow focus:border-blue-500 transition duration-150 ease-in-out ${isLoadingUpdateDelay &&
                                'cursor-not-allowed bg-slate-200 text-slate-400'}`}
                        />
                        <button
                            type="submit"
                            disabled={isLoadingUpdateDelay}
                            className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out ${
                                isLoadingUpdateDelay
                                    ? 'cursor-progress bg-slate-200'
                                    : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                            }`}
                        >
                            {isLoadingUpdateDelay ? <Spin spinning={isLoadingUpdateDelay} /> : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminConfigurationUpdateDelay;
