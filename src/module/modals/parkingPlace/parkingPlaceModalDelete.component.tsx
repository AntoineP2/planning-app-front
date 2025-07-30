'use client';
import { Spin, } from 'antd';
import { IoMdCloseCircle } from 'react-icons/io';
import { useParkingPlaceStore } from '~/module/admin/admin-configuration/parkingPlaceConfiguration/_store/parkingPlace.store';

const ParkingPlaceDeleteModal = () => {
    const { isLoading, activeModal, parkingPlaceSelected, getAllParkingPlace, setParkingPlaceSelected, setActiveModal, deleteParkingPlace } = useParkingPlaceStore()

    const handleCloseModal = () => {
        setParkingPlaceSelected({
            id: '',
            name: '',
            chargingStation: false,
            entrepriseId: '',
            underground: false,
        });
        setActiveModal(null);
    };

    const handleDeleteCompany = async () => {
        const id = parkingPlaceSelected.id;
        await deleteParkingPlace(id);
        setParkingPlaceSelected({
            id: '',
            name: '',
            chargingStation: false,
            entrepriseId: '',
            underground: false,
        });
        getAllParkingPlace();
        setActiveModal(null);
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${activeModal === 'delete' ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-blue-500 shadow-lg w-[45%] h-[30%] max-md:w-[90%] transition duration-300 ${activeModal === 'delete' ? 'scale-100' : 'scale-0'
                    }`}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="w-[100%] max-md:w-[90%] h-[200px] rounded-lg flex flex-col justify-center items-center">
                        <p className="text-lg text-center">
                            Voulez-vous supprimer la place numéro{' '}
                            <span className="font-semibold text-primary">{parkingPlaceSelected.name} </span>?
                            <br />
                        </p>
                        <p className="text-red-600 font-semibold mt-5">Attention, cette action est irréversible</p>
                        <div className='flex justify-center gap-5'>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={handleDeleteCompany}
                                className="bg-red-600 text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 hover:bg-red-500 active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                {isLoading ? <Spin spinning={isLoading} /> : 'Oui'}
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={handleCloseModal}
                                className="bg-primary text-white disabled:bg-slate-400 px-5 py-2 rounded-lg mt-5 hover:bg-primary-light active:scale-95 transition duration-150 min-w-[150px] ease-in-out"
                            >
                                {isLoading ? <Spin spinning={isLoading} /> : 'Annuler'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParkingPlaceDeleteModal;
