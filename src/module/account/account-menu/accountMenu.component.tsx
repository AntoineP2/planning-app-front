"use client"
import React from 'react'
import { useAccountStore } from '../_store/account.store'
import { accountMenu } from '../account.utils'

const AccountMenu = () => {
    const {accountMenuSelected, setAccountMenuSelected} = useAccountStore()

  return (
    <>
        <div>
            {accountMenu && accountMenu.map(menu => (
                <div key={menu.id}>
                    <button onClick={() => setAccountMenuSelected(menu.id)} className={`flex rounded-lg items-center w-full py-2 px-4 hover:bg-slate-50 ${accountMenuSelected === menu.id ? 'bg-slate-100 text-primary' : 'text-slate-800'} transition duration-100 ease-in-out`}>
                        <div className="mr-3">{menu.icon}</div>
                        <div>{menu.title}</div>
                    </button>
                </div>
            ))}
        </div>
    </>
  )
}

export default AccountMenu