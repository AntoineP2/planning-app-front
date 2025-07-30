'use client';
import { IoMdCloseCircle } from 'react-icons/io';
import { useParkingPlaceStore } from '~/module/admin/admin-configuration/parkingPlaceConfiguration/_store/parkingPlace.store';
import ParkingPlaceCreateForm from '~/module/admin/admin-configuration/parkingPlaceConfiguration/parkingPlaceTable/parkingPlaceCreateForm/ParkingPlaceCreateForm.component';
import ParkingPlaceUpdateForm from '~/module/admin/admin-configuration/parkingPlaceConfiguration/parkingPlaceTable/parkingPlaceUpdateForm/ParkingPlaceUpdateForm.component';

const ParkingPlaceCreateUpdateModal = () => {
    const { activeModal, setParkingPlaceSelected, setActiveModal } = useParkingPlaceStore()

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

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${activeModal === 'create' || activeModal === 'update' ? 'scale-100' : 'scale-0'
                }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg md:w-[70%] md:h-auto w-[90%] h-auto transition duration-300 flex justify-center items-center py-16 ${activeModal === 'create' || activeModal === 'update' ? 'scale-100' : 'scale-0'
                    }`}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <div className="w-full">
                    {activeModal === 'create' && <ParkingPlaceCreateForm />}
                    {activeModal === 'update' && <ParkingPlaceUpdateForm />}
                </div>
            </div>
        </div>
    );
};

export default ParkingPlaceCreateUpdateModal;
