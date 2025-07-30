'use client';

import { ConfigProvider, DatePicker, Form, Select, Spin } from 'antd';
import locale from 'antd/locale/fr_FR';
import { useEffect, useState } from 'react';
import { useUserListStore } from '../../user-configuration/user-list/_store/userList.store';
import { UserConfigurationType } from '../../user-configuration/user-list/userList.utils';
import { useRttEmployerStore } from './_store/rttEmployer.store';

const RttEmployer = () => {
    const [form] = Form.useForm();
    const { getAllUsers, userList } = useUserListStore();
    const {
        isLoading,
        selectedDate,
        selectedUserId,
        setSelectedDate,
        setSelectedUserId,
        setRttEmployerEvent,
    } = useRttEmployerStore();
    const [userListFiltered, setUserListFiltered] = useState<UserConfigurationType[]>([
        {
            id: '',
            firstName: '',
            lastName: '',
            active: false,
            trigramme: '',
            workTypeId: '',
        },
    ]);

    const onChange = (date: string, dateString: string | string[]) => {
        setSelectedDate(dateString as string[]);
    };

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        setSelectedUserId([]);
        if (userList) {
            setUserListFiltered(userList.filter(user => user.active));
        }
    }, [setSelectedUserId, userList]);

    const handleSubmit = async () => {
        await setRttEmployerEvent(selectedUserId, selectedDate);
        setSelectedUserId([]);
        setSelectedDate([]);
        form.resetFields();
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center w-[70%] max-md:w-full items-center gap-8 md:my-10 md:mx-10 max-md:ml-5 pb-5 shadow-lg border">
                <h1 className="font-semibold text-lg mt-2">Affecter des RTT Employeur</h1>
                <div className="w-[70%] flex flex-col gap-2">
                    <p className="text-sm italic pl-3">Sélectionner les employés :</p>
                    {userList ? (
                        <Select
                            mode="multiple"
                            value={selectedUserId}
                            style={{ width: '100%' }}
                            onChange={setSelectedUserId}
                            placeholder="Les employés"
                            disabled={isLoading}
                            className="shadow-lg"
                            options={[
                                ...userListFiltered.map(user => ({
                                    value: user.id,
                                    label: `${user.firstName} ${user.lastName}`,
                                })),
                            ]}
                        />
                    ) : (
                        'Chargement...'
                    )}
                </div>
                <div className="w-[70%] flex flex-col gap-2">
                    <p className="text-sm italic pl-3">Sélectionner les dates :</p>
                    <Form form={form}>
                        <Form.Item name="selectedDate" rules={[{ required: true }]}>
                            <ConfigProvider locale={locale}>
                                <DatePicker
                                    multiple
                                    disabled={isLoading}
                                    placeholder="Sélectionner les dates"
                                    maxTagCount="responsive"
                                    onChange={onChange}
                                    format="DD/MM/YYYY"
                                    className="shadow-lg"
                                />
                            </ConfigProvider>
                        </Form.Item>
                    </Form>
                </div>
                <div className="">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out ${
                            isLoading ? 'cursor-progress bg-slate-200' : 'bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                        }`}
                    >
                        {isLoading ? <Spin spinning={isLoading} /> : 'Affecter'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RttEmployer;
