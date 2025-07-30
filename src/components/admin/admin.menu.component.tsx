'use client';

import { Tooltip } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HomeMenuChoices } from '~/module/home/home.utils';

const AdminMenu = ({ title, image, path }: HomeMenuChoices) => {
    const router = useRouter();
    return (
        <>
            <div className="relative group">
                <button onClick={() => router.push(path)}>
                    <div className='flex gap-2 justify-center items-center'>
                    <Image
                        src={image}
                        alt="calendarTeam"
                        width={70}
                        className="rounded-md min-h-[70px] max-h-[70px] transition duration-150 ease-in-out group group-hover:scale-105"
                    />
                    <div className="flex items-center justify-center h-full w-full top-0 group">
                        <p className="group-hover:text-primary text-primary-lightDark group transition duration-75 ease-in-out text-xl ">
                            {title}
                        </p>
                    </div>
                    </div>
                </button>
            </div>
        </>
    );
};

export default AdminMenu;