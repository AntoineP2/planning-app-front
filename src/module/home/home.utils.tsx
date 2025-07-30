import { StaticImageData } from 'next/image';
import calendarTeamImage from '../../../public/calendarTeam.png';
import myCalendarImage from '../../../public/myCalendar.png';

export type HomeMenuChoices = {
    title: string;
    image: StaticImageData;
    path: string;
};

export const homeMenuChoicesCollaborator: HomeMenuChoices[] = [
    {
        title: 'Mon calendrier',
        image: myCalendarImage,
        path: '/espace-utilisateur/calendrier',
    },
    {
        title: "Vue d'ensemble de l'équipe",
        image: calendarTeamImage,
        path: '/espace-utilisateur/vue-d-ensemble',
    },
];
