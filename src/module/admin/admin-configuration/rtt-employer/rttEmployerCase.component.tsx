'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import rttImage from '../../../../../public/admin-image/rtt.png';

const RttEmployerCase = () => {
    const router = useRouter();

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={rttImage} alt="parking" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">RTT Employeur</h2>
                </div>
                <div>
                    <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-10">
                        <p> Affecter des RTT Employeur.</p>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/configuration/rtt-employeur')}
                            className={`text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95 `}
                        >
                            Configuration
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RttEmployerCase;
