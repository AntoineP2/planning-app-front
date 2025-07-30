import { FaRegUserCircle } from "react-icons/fa"
import { WorkTypeType } from "../admin/admin-configuration/workType/workTypeTable/workTypeTable.utils"
import { GrConfigure } from "react-icons/gr"

export type AccountStoreType = {

    accountMenuSelected: AccountMenuEnum
    workType: WorkTypeType
    isLoading: boolean
    setAccountMenuSelected: (menu: AccountMenuEnum) => void
    getWorkType: (userId: string) => Promise<void>
}

export type AccountMenuType = {
    id: AccountMenuEnum
    title: string
    icon: JSX.Element
}

export enum AccountMenuEnum {
    PROFIL = 'profil',
    CONFIG = 'config'
}

export const accountMenu: AccountMenuType[] = [
    {
        id: AccountMenuEnum.PROFIL,
        title: 'Mes informations',
        icon: <FaRegUserCircle size={25} />
    },
    {
        id: AccountMenuEnum.CONFIG,
        title: 'Mes profils horaires',
        icon: <GrConfigure size={25}/>
    }
]