'use client';
import { IoMdCloseCircle } from 'react-icons/io';
import { useWorkTypeStore } from '~/module/admin/admin-configuration/workType/workTypeTable/_store/workTypeForm.store';
import WorkTypeCreateForm from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeCreateForm/workTypeCreateForm.component';
import WorkTypeUpdateForm from '~/module/admin/admin-configuration/workType/workTypeTable/workTypeUpdateForm/workTypeUpdateForm.component';

const WorkTypeCreateUpdateModal = () => {
    const {
        updateWorkTypeModalFormState,
        createWorkTypeModaleState,
        selectedWorkType,
        isLoading,
        setUpdateWorkTypeModalFormState,
        setCreateWorkTypeModaleState,
        setWorkTypeSelected,
        getWorkTypeList,
    } = useWorkTypeStore();

    const handleCloseModal = () => {
        setWorkTypeSelected({
            id: '',
            name: '',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            weeklyHour: '',
        });
        setUpdateWorkTypeModalFormState(false);
        setCreateWorkTypeModaleState(false);
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${
                createWorkTypeModaleState || updateWorkTypeModalFormState ? 'scale-100' : 'scale-0'
            } `}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg md:w-[70%] md:h-auto w-[90%] h-auto transition duration-300 flex justify-center items-center py-16 ${
                    createWorkTypeModaleState || updateWorkTypeModalFormState ? 'scale-100' : 'scale-0'
                }`}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <div className="w-full">
                    {createWorkTypeModaleState && <WorkTypeCreateForm />}
                    {updateWorkTypeModalFormState && <WorkTypeUpdateForm />}
                </div>
            </div>
        </div>
    );
};

export default WorkTypeCreateUpdateModal;
