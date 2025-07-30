"use client"

import { useEffect } from "react"
import { useAccountProfileStore } from "./_store/accountProfile.store"
import { useAuthenticationStore } from "~/module/authentication/_store/authentication.store"
import { Space, Table, Tooltip } from "antd"
import { AccountProfileTableType } from "./accountProfile.utils"
import { IoMdAddCircle } from "react-icons/io"
import { TableProps } from "antd/lib"

const AccountProfile = () => {
  const {isLoading, profilesListFormatted, profilesList, getProfilesList, setModalState, setProfileSelected} = useAccountProfileStore()
  const {userId} = useAuthenticationStore()

  useEffect(() => {
    if(userId){
      getProfilesList(userId)
    }
  }, [userId, getProfilesList])

  const columns: TableProps<AccountProfileTableType>['columns'] = [
    {
        title: 'Nom du profil',
        dataIndex: 'name',
        key: 'name',
        render: text => <p className="font-semibold capitalize">{text}</p>,
    },
    {
        title: 'Matin',
        dataIndex: 'titleAm',
        key: 'titlePm',
        render: text => <p className='italic'>{text}</p>,
    },
    {
        title: 'Après-midi',
        dataIndex: 'titlePm',
        key: 'titlePm',
        render: text => <p className='italic'>{text}</p>,
    },
    {
        title: 'Heure du matin',
        dataIndex: 'hourlyAm',
        key: 'hourlyAm',
        render: text => <p className='italic'>{text}</p>,
    },
    {
        title: 'Heure de l\'après-midi',
        dataIndex: 'hourlyPm',
        key: 'hourlyPm',
        render: text => <p className='italic'>{text}</p>,
    },
    {
      title: 'Heure de travail total',
      dataIndex: 'workTime',
      key: 'workTime',
      render: text => <p className='italic'>{text}</p>,
  },
  {
    title: 'Parking',
    dataIndex: 'parking',
    key: 'parking',
    render: value => <p className='italic'>{value ? "Oui" : "Non"}</p>,
  },
  // {
  //   title: 'Public',
  //   dataIndex: 'isPublic',
  //   key: 'isPublic',
  //   render: value => <p className='italic'>{value ? "Oui" : "Non"}</p>,
  // },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <button className='font-semibold text-primary hover:text-[#54d4d8] active:scale-95 transition duration-100 ease-in-out' onClick={() => handleOpenUpdateModal(record)}>Modifier</button>
                <button className='font-semibold text-red-600 hover:text-red-500 active:scale-95 transition duration-100 ease-in-out' onClick={() => handleOpenDeleteModal(record)} >Supprimer</button>
            </Space>
        ),
    },
];

  const handleOpenDeleteModal = (record: AccountProfileTableType) => {
    setProfileSelected({
      id: record.key,
      name: record.name,
      titleAm: record.titleAm,
      titlePm: record.titlePm,
      hourlyAm: record.hourlyAm,
      hourlyPm: record.hourlyPm,
      workTime: record.workTime,
      parking: record.parking,
      isPublic: record.isPublic,
      ownerId: record.ownerId
    })
    setModalState('delete')
  }

  const handleOpenUpdateModal = (record: AccountProfileTableType) => {
    setProfileSelected({
      id: record.key,
      name: record.name,
      titleAm: record.titleAm,
      titlePm: record.titlePm,
      hourlyAm: record.hourlyAm,
      hourlyPm: record.hourlyPm,
      workTime: record.workTime,
      parking: record.parking,
      isPublic: record.isPublic,
      ownerId: record.ownerId
    })
    setModalState('edit')
  }

  return (
    <>
        <div>
            <h2 className='text-primary text-xl font-semibold mb-4'>Mes profils horaires</h2>
        </div>
        <div>
          <div className="flex justify-end mb-3">
            <Tooltip title='Créer un nouveau profil'>
                <button onClick={() => setModalState('create')} className='text-primary hover:text-primary-light active:scale-95 transition duration-150 ease-in-out'>
                    <IoMdAddCircle size={35} />
                </button>
            </ Tooltip>
          </div>
          <Table
            columns={columns}
            dataSource={profilesListFormatted}
            className=" shadow-lg px-5 py-2 mb-5 rounded-md"
            loading={isLoading}
          />
        </div>

    </>
    
  )
}

export default AccountProfile