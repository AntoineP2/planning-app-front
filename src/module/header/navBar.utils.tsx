import { FaCalendarAlt, FaUserCircle, FaUsers } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

export const nabBarItems = [
    {
        id: 1,
        title: 'Mon calendrier',
        path: '/espace-utilisateur/calendrier',
        icon: <FaCalendarAlt size={30} />
    },
    {
        id: 2,
        title: "Vue d'ensemble",
        path: '/espace-utilisateur/vue-d-ensemble',
        icon: <FaUsers size={30} />
    },
    {
        id: 3,
        title: 'Mon compte',
        path: '/espace-utilisateur/compte',
        icon: <FaUserCircle size={30} />
    },
];

export const nabBarItemsAdmin = [
    {
        id: 1,
        title: 'Administration',
        path: '/admin',
        icon: <IoSettingsSharp size={30} />
    },
];
