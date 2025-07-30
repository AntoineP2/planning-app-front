import AccountProfileDeleteModal from './accountProfile/accountProfileDeleteModal';
import AccountProfileModal from './accountProfile/accountProfileModal.component';
import AdminCalendarChoiceModal from './admin-calendar/adminCalendarModalChoice.component';
import AdminCalendarCreateModal from './admin-calendar/adminCalendarModalCreate.component';
import AdminCalendarDeleteModal from './admin-calendar/adminCalendarModalDelete.component';
import AdminCalendarUpdateModal from './admin-calendar/adminCalendarModalUpdate.component';
import CalendarChoiceModal from './calendar/calendarModalChoice.component';
import CalendarCreateModal from './calendar/calendarModalCreate.component';
import CalendarDeleteModal from './calendar/calendarModalDelete.component';
import CalendarUpdateModal from './calendar/calendarModalUpdate.component';
import CalendarValidateModal from './calendar/calendarModalValidate.component';
import CompanyCreateUpdateModal from './company/companyModalCreateUpdate.component';
import CompanyDeleteModal from './company/companyModalDelete.component';
import ParkingPlaceCreateUpdateModal from './parkingPlace/parkingPlaceModalCreateUpdate.component';
import ParkingPlaceDeleteModal from './parkingPlace/parkingPlaceModalDelete.component';
import WorkTypeCreateUpdateModal from './workType/workTypeModalCreateUpdate.component';
import WorkTypeDeleteModal from './workType/workTypeModalDelete.component';

const Modals = () => {
    return (
        <>
            <CalendarDeleteModal />
            <CalendarUpdateModal />
            <CalendarChoiceModal />
            <CalendarCreateModal />
            <WorkTypeDeleteModal />
            <WorkTypeCreateUpdateModal />
            <AdminCalendarChoiceModal />
            <AdminCalendarCreateModal />
            <AdminCalendarUpdateModal />
            <AdminCalendarDeleteModal />
            <CompanyCreateUpdateModal />
            <CompanyDeleteModal />
            <ParkingPlaceCreateUpdateModal />
            <ParkingPlaceDeleteModal />
            <CalendarValidateModal />
            <AccountProfileModal />
            <AccountProfileDeleteModal />
        </>
    );
};

export default Modals;
