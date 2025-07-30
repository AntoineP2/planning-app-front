'use client';
import { useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useAccountProfileStore } from '~/module/account/account-profile/_store/accountProfile.store';
import { useAccountProfileFormStore } from '~/module/account/account-profile/account-profile-form/_store/accountProfileForm.store';
import AccountProfileCreateForm from '~/module/account/account-profile/account-profile-form/accountProfileCreateForm';
import AccountProfileUpdateForm from '~/module/account/account-profile/account-profile-form/accountProfileUpdateForm';

const AccountProfileModal = () => {
    const {modalState, resetProfileSelected, setModalState} = useAccountProfileStore()
    const {resetData} = useAccountProfileFormStore()


    const handleCloseModal = () => {
        setModalState('close');
        resetData();
        resetProfileSelected();
    };

    return (
        <div
            className={`fixed top-0 right-0 w-screen h-screen bg-white bg-opacity-80 flex justify-center items-center px-2 md:px-0 ${['edit', 'create'].includes(modalState) ? 'scale-100' : 'scale-0'
                } overflow-y-scroll`}
        >
            <div
                className={`relative rounded-lg bg-blue-50 border-2 border-primary shadow-lg w-[60%] pb-5 max-md:w-[90%] md:min-w-[900px] transition duration-300 ${['edit', 'create'].includes(modalState) ? 'scale-100' : 'scale-0'
                    }`}
            >
                <div className="relative z-10 max-md:mb-3 ">
                    <div className="flex justify-end w-full items center max-md:mt-4 px-2">
                        <button
                            onClick={handleCloseModal}
                            className="max-md:active:scale-95 md:hover:scale-105 transition duration-150 ease-in-out text-primary hover:text-primary-dark"
                        >
                            <IoMdCloseCircle size={40} />
                        </button>
                    </div>
                </div>
                <div className="md:relative flex justify-center items-center px-5 w-full">
                    <div className="min-w-[90%] max-md:w-[90%] md:h-[80%] flex flex-col justify-center items-center ">
                    {modalState === 'create' && <AccountProfileCreateForm />}
                    {modalState === 'edit' && <AccountProfileUpdateForm />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountProfileModal;
