'use client';

import { useEffect } from 'react';
import { useUserListStore } from './_store/userList.store';

const UserList = () => {
    const { userList, selectedUser, getAllUsers, setSelectedUser } = useUserListStore();

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    return (
        <>
            <div className="w-[200px] shadow-lg border">
                {userList &&
                    userList.map(user => (
                        <div key={user.id} className={`border text-center font-semibold text-sm py-2 ${selectedUser?.id === user.id ? "bg-slate-200 text-primary": ""} transition ease-in-out duration-150`}>
                            <button onClick={() => setSelectedUser(user)} className={`w-full h-full ${user.active ? "" : "text-red-600"}`}>
                                {user.firstName} {user.lastName}
                            </button>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default UserList;
