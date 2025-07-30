'use client';
import { IoMdCloseCircle } from 'react-icons/io';
import { useCompanyStore } from '~/module/admin/admin-configuration/buildingConfiguration/companyConfigurationTable/_store/company.store';
import CompanyCreateForm from '~/module/admin/admin-configuration/buildingConfiguration/companyConfigurationTable/CompanyCreateForm/CompanyCreateForm.component';
import CompanyUpdateForm from '~/module/admin/admin-configuration/buildingConfiguration/companyConfigurationTable/CompanyUpdateForm/CompanyUpdateForm.component';

const CompanyCreateUpdateModal = () => {
    const {isModalCreateVisible, isModalUpdateVisible, setCompanySelected, setIsModalCreateVisible, setIsModalUpdateVisible} = useCompanyStore();

    const handleCloseModal = () => {
        setCompanySelected({
            id: '',
            name: '',
            description: '',
            officeNumber: '',
        });
        setIsModalCreateVisible(false);
        setIsModalUpdateVisible(false);
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${
                isModalCreateVisible || isModalUpdateVisible ? 'scale-100' : 'scale-0'
            }`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg md:w-[70%] md:h-auto w-[90%] h-auto transition duration-300 flex justify-center items-center py-16 ${
                    isModalCreateVisible || isModalUpdateVisible ? 'scale-100' : 'scale-0'
                }`}
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute flex items-center justify-center top-5 right-5 max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out"
                >
                    <IoMdCloseCircle size={40} />
                </button>
                <div className="w-full">
                    {isModalCreateVisible && <CompanyCreateForm />}
                    {isModalUpdateVisible && <CompanyUpdateForm />}
                </div>
            </div>
        </div>
    );
};

export default CompanyCreateUpdateModal;
