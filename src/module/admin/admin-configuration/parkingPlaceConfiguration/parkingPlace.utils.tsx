

export type ParkingPlaceStoreStateType = {
    isLoading: boolean,
    parkingPlaceList: ParkingPlaceType[],
    parkingPlaceTableList: ParkingPlaceTableType[],
    activeModal: 'create' | 'update' | 'delete' | null;
    parkingPlaceSelected: ParkingPlaceType,
    setParkingPlaceSelected: (value: ParkingPlaceType) => void,
    setActiveModal: (modal: 'create' | 'update' | 'delete' | null) => void;
    getAllParkingPlace: () => Promise<void>,
    createParkingPlace: (parkingPlace: ParkingPlaceCreateType) => Promise<void>,
    deleteParkingPlace: (id: string) => Promise<void>,
    updateParkingPlace: (parkingPlace: ParkingPlaceType) => Promise<void>

}

export type ParkingPlaceFormType = {
    name: string,
    chargingStation: boolean,
    underground: boolean,
    entrepriseId: string,
};

export type ParkingPlaceType = {
    id: string,
    name: string,
    chargingStation: boolean,
    underground: boolean,
    entrepriseId: string,
}

export type ParkingPlaceCreateType = {
    name: string,
    chargingStation: boolean,
    underground: boolean,
    entrepriseId: string,
}

export type ParkingPlaceTableType = {
    key: string,
    name: string,
    chargingStation: boolean,
    underground: boolean,
    entrepriseId: string,

}

export const formatParkingPlaceList = (
    parkingPlaceList: ParkingPlaceType[],
): ParkingPlaceTableType[] => {
    return parkingPlaceList.map(parkingPlace => ({
        key: parkingPlace.id,
        name: parkingPlace.name,
        chargingStation: parkingPlace.chargingStation,
        underground: parkingPlace.underground,
        entrepriseId: parkingPlace.entrepriseId,
    }));
};