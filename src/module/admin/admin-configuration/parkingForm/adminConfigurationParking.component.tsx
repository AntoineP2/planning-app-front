'use client';
import { Spin } from 'antd';
import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'sonner';
import parkingImage from '../../../../../public/admin-image/parking.png';
import { useAdminConfigurationStore } from '../_store/adminConfiguration.store';

const AdminConfigurationParkingForm = () => {
    const {
        isLoading,
        parkingPlaces,
        setParkingPlacesToSave,
        setParkingPlaces,
        updateParkingPlaces,
    } = useAdminConfigurationStore();

    const onChangeParkingPlaces = (value: string) => {
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
            setParkingPlacesToSave(parsedValue);
        } else {
            console.error("La valeur fournie n'est pas un nombre valide");
        }
    };

    useEffect(() => {
        setParkingPlaces();
    }, [setParkingPlaces]);

    const onSubmitParkingPlaces = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isNaN(parkingPlaces) || parkingPlaces < 0 || parkingPlaces > 100) {
            toast.error('Veuillez entrer un nombre valide entre 0 et 100.');
            return;
        }
        await updateParkingPlaces(parkingPlaces);
    };

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={parkingImage} alt="parking" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Places de parking disponibles</h2>
                </div>
                <form onSubmit={onSubmitParkingPlaces}>
                    <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-10">
                        <input
                            type="number"
                            value={parkingPlaces}
                            min={0}
                            max={100}
                            disabled={isLoading}
                            onChange={e => onChangeParkingPlaces(e.target.value)}
                            className={`appearance-none outline-none border p-2 rounded-md w-1/2 shadow focus:border-blue-500 transition duration-150 ease-in-out ${isLoading &&
                                'cursor-not-allowed bg-slate-200 text-slate-400'}`}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out ${isLoading
                                    ? 'cursor-progress bg-slate-200'
                                    : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                                }`}
                        >
                            {isLoading ? <Spin spinning={isLoading} /> : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminConfigurationParkingForm;
