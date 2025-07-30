'use client';
import { useRouter } from 'next/navigation';
import { IoArrowBackCircle } from 'react-icons/io5';
import RegisterForm from './registerForm/registerForm.component';

const Register = () => {
    const router = useRouter();
    return (
        <>
            <div className="flex relative flex-col justify-center items-center gap-3 md:w-[550px] w-[80%] bg-white shadow-xl py-10 px-14 ">
                <button
                    className="md:hidden absolute top-2 left-2 text-primary hover:text-primary-dark active:scale-95 transition duration-150 ease-in-out"
                    onClick={() => router.push('/connexion')}
                >
                    <IoArrowBackCircle size={40} />
                </button>
                <h2 className="text-2xl font-semibold text-blue-950">Inscription</h2>
                <RegisterForm />
            </div>
        </>
    );
};

export default Register;
