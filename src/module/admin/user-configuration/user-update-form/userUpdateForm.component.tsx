'use client';

import { Checkbox, GetProp, Select, Spin, Switch, Tooltip } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { useWorkTypeStore } from '../../admin-configuration/workType/workTypeTable/_store/workTypeForm.store';
import { useUserListStore } from '../user-list/_store/userList.store';
import { useUserUpdateFormStore } from './_store/userUpdateForm.store';
import { UserUpdateFormType } from './userUpdateForm.utils';
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store';

const UserUpdateForm = () => {
    const { selectedUser, getAllUsers, setSelectedUser } = useUserListStore();
    const { userRole } = useAuthenticationStore()
    const { active, isLoading, workTypeId, roleListFormatted, userRoleListFormatted, updateUserRole, getUserRoleList, getRoleList, setWorkTypeId, setActive, updateUser, setUserRoleList } = useUserUpdateFormStore();
    const { workTypeList, getWorkTypeList } = useWorkTypeStore();
    const router = useRouter()
    const searchParams = useSearchParams()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UserUpdateFormType>();

    useEffect(() => {
        getWorkTypeList();
    }, [getWorkTypeList]);


    useEffect(() => {
        if (selectedUser) {
            getUserRoleList(selectedUser.id);
            getRoleList();
            setWorkTypeId(selectedUser.workTypeId);
            setActive(selectedUser.active);
        }
    }, [getRoleList, getUserRoleList, selectedUser, setActive, setWorkTypeId]);

    const onChange = (checked: boolean) => {
        setActive(checked);
    };

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const onSubmit: SubmitHandler<UserUpdateFormType> = async () => {
        if (!selectedUser) return;
        await updateUserRole(selectedUser.id, userRoleListFormatted);
        await updateUser(selectedUser.id, active, workTypeId);
        await getAllUsers();
    };

    const handleClickCalendar = () => {
        if (selectedUser) {
            router.push('configuration-utilisateur/calendrier-utilisateur/?' + createQueryString('userId', selectedUser.id) + '&' + createQueryString('userName', selectedUser.firstName + ' ' + selectedUser.lastName))
        }
    }

    const onChangeRole: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        setUserRoleList(checkedValues as any);
    };

    const isDisabledOptionRole = (roleId: string, userRole: string[]): boolean => {
        if (roleId === process.env.NEXT_PUBLIC_SUPER_ADMIN_ID) return true;
        if (roleId === process.env.NEXT_PUBLIC_ADMIN_ID && !userRole.includes("superAdmin")) return true;
        return false
    }

    return (
        <>
            <div className=" w-full relative py-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex max-md:flex-col justify-center items-center gap-3 text-sm w-full ">
                        <div className='w-full'>
                            <h2 className="text-xl font-bold mb-6 ml-5">{selectedUser?.firstName} {selectedUser?.lastName}</h2>
                            <div className=' flex justify-center items-center flex-col gap-5'>
                                <div className="flex justify-center flex-col items-start gap-5 max-md:w-full w-[60%] shadow-lg px-5 py-5 border">
                                    <div className='flex justify-between items-center w-full'>
                                        <label className="font-semibold">Type de profil </label>
                                        {workTypeList && (
                                            <Select value={workTypeId} style={{ width: 150 }} onChange={setWorkTypeId} options={workTypeList.map(value => ({
                                                label: value.name,
                                                value: value.id,
                                            }))} />)}
                                    </div>

                                    <div className='flex justify-between items-center w-full'>
                                        <label className="font-semibold"> Utilisateur actif</label>
                                        <Switch value={active} onChange={onChange} />
                                    </div>

                                    <div className='flex justify-between items-center w-full'>
                                        <label className="font-semibold"> Modifier l&apos;emploi du temps</label>
                                        <button type="button" className='text-primary hover:text-[#55d5da]' onClick={() => handleClickCalendar()}> <FaEdit size={35} /></button>
                                    </div>

                                    <div className='flex justify-between items-center w-full'>
                                        <label className="font-semibold"> Modifier les rôles</label>
                                        <div className='flex flex-col capitalize'>
                                            <Checkbox.Group options={roleListFormatted.map(role => { return { ...role, disabled: isDisabledOptionRole(role.value, userRole) } })} value={userRoleListFormatted} onChange={onChangeRole} />
                                        </div>
                                    </div>

                                </div>
                                <div className='max-md:w-full w-[60%] flex justify-end'>
                                    <button
                                        className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                                        disabled={isLoading}
                                    >
                                        {' '}
                                        {isLoading ? (
                                            <Spin spinning={isLoading} />
                                        ) : (
                                            <div className="flex justify-center items-center gap-3 text-white">
                                                <p className="text-sm">Enregistrer</p>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UserUpdateForm;
