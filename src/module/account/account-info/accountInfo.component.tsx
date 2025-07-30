"use client"
import { useEffect } from 'react'
import { useAuthenticationStore } from '~/module/authentication/_store/authentication.store'
import { useAccountStore } from '../_store/account.store'

const AccountInfo = () => {
  const {userFirstName, userLastName, userTrigramme, userMail, userId} = useAuthenticationStore()
  const {workType, isLoading, getWorkType} = useAccountStore()

  useEffect(() => {
    if(userId){
        getWorkType(userId)
    }
}, [getWorkType, userId])

  return (
    <div>
      <div className='mb-8'>
        <h2 className='text-primary text-xl font-semibold mb-4'>Mes informations personnelles</h2>
        <div className='flex flex-col gap-2'>
          <div>
            <h3 className='font-semibold'>Nom</h3>
            <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
              <p>{userLastName}</p>
            </div>
          </div>

          <div>
            <h3 className='font-semibold'>Prénom</h3>
            <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
              <p>{userFirstName}</p>
            </div>
          </div>

          <div>
            <h3 className='font-semibold'>Trigramme</h3>
            <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
              <p>{userTrigramme}</p>
            </div>
          </div>

          <div>
            <h3 className='font-semibold'>Mail</h3>
            <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
              <p>{userMail}</p>
            </div>
          </div>
        </div>
      </div>
        
        
       
        <div>
          <h2 className='text-primary text-xl font-semibold mb-4'>Mon poste</h2>
          <div className='flex flex-col gap-2'>
            <div>
              <h3 className='font-semibold'>Fonction</h3>
              <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
                <p>{isLoading ? "Chargement..." : workType.name}</p>
              </div>
            </div>
            <div>
              <h3 className='font-semibold'>Heures hebdomadaire</h3>
              <div className='shadow-lg max-md:w-full w-[60%] border-[1px] rounded-lg pl-2 py-1 cursor-default italic'>
              <p>{isLoading ? "Chargement..." : workType.weeklyHour + " heures"}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AccountInfo