'use client';
import Image from 'next/image';
import rapportPresenceImage from '../../../../../public/admin-image/rapportPresence.png';
import { useRouter } from 'next/navigation';

const AdminConfigurationReportPdf = () => {
    const router = useRouter()

    return (
        <>
            <div className="min-h-[100px] w-[60%] max-md:w-[95%] border shadow-lg">
                <div className="flex max-md:ml-2 items-center gap-5 md:ml-5 mt-3 ">
                    <Image src={rapportPresenceImage} alt="officeWorkImage" width={50} />
                    <h2 className="text-xl max-md:text-lg font-semibold">Rapport de présence</h2>
                </div>
                <div className="flex justify-between mb-3 md:px-10 max-md:px-5 mt-10">
                    <p>Configuration du pdf du rapport de présence.</p>
                    <button
                        onClick={() => router.push('/admin/configuration/rapport-pdf')}
                        type="button"
                        className='text-white p-2 w-[130px] rounded-md shadow transition duration-150 ease-in-out bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t active:scale-95'
                    >
                        Configuration
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminConfigurationReportPdf;
