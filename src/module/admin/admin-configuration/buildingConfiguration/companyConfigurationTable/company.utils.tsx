

export type CompanyStoreStateType = {
    isLoading: boolean,
    companyList: CompanyType[],
    companyTableList: CompanyTableType[],
    isModalUpdateVisible: boolean,
    isModalCreateVisible: boolean,
    isModalDeleteVisible: boolean,
    companySelected: CompanyType,
    parkingPlacesCount: CountParkingPlacesType[],
    getParkingPlacesCount: () => Promise<void>,
    setCompanySelected: (value: CompanyType) => void,
    setIsModalUpdateVisible: (value: boolean) => void,
    setIsModalCreateVisible: (value: boolean) => void,
    setIsModalDeleteVisible: (value: boolean) => void,
    getAllCompany: () => Promise<void>,
    createCompany: (name: string, description: string, officeNumber: string) => Promise<void>,
    deleteCompany: (id: string) => Promise<void>,
    updateCompany: (company: CompanyType) => Promise<void>

}

export type CountParkingPlacesType = {
    companyId: string,
    total: number,
    underground: number,
    notUnderground: number
}

export type CompanyFormType = {
    name: string;
    description: number;
    officeNumber: number;
};

export type CompanyType = {
    id: string,
    name: string,
    description: string,
    officeNumber: string,

}

export type CompanyTableType = {
    key: string,
    name: string,
    description: string,
    officeNumber: string,

}

export const formatCompanyList = (
    companyList: CompanyType[],
): CompanyTableType[] => {
    return companyList.map(company => ({
        key: company.id,
        name: company.name,
        description: company.description,
        officeNumber: company.officeNumber,
    }));
};