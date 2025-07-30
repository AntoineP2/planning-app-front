import { StaticImageData } from 'next/image';
import settingImage from '../../../public/admin-image/setting.png';
import userSettingImage from '../../../public/admin-image/userSetting.png';

export type HomeMenuChoices = {
    title: string;
    image: StaticImageData;
    path: string;
};

export const AdminMenuChoices: HomeMenuChoices[] = [
    {
        title: 'Configuration Générale',
        image: settingImage,
        path: '/admin/configuration',
    },
    {
        title: 'Configuration des utilisateurs',
        image: userSettingImage,
        path: '/admin/configuration-utilisateur',
    },
];
