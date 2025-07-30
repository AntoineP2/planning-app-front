'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HomeMenuChoices } from '~/module/home/home.utils';

const HomeMenu = ({ title, image, path }: HomeMenuChoices) => {
    const router = useRouter();
    return (
        <>
            <div className="relative group">
                <button onClick={() => router.push(path)}>
                    <Image
                        src={image}
                        alt="calendarTeam"
                        width={500}
                        className="border rounded-md min-h-[300px] max-h-[300px] shadow-lg brightness-[0.15] blur-[3px] transition duration-150 ease-in-out group group-hover:filter-none group-hover:scale-105"
                    />
                    <div className="absolute flex items-center justify-center h-full w-full top-0 group">
                        <p className="group-hover:scale-0 group transition duration-75 ease-in-out text-xl font-bold text-blue-200 ">
                            {title}
                        </p>
                    </div>
                </button>
            </div>
        </>
    );
};

export default HomeMenu;
