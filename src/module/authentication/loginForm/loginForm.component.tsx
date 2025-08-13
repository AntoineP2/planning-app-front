'use client';
import { Spin } from 'antd';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaLock, FaUser } from 'react-icons/fa';
import { useAuthenticationStore } from '../_store/authentication.store';
import { SignInType } from './loginForm.utils';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { getUser, loading } = useAuthenticationStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInType>();

    const onSubmit: SubmitHandler<SignInType> = async (data) => {
        try {
            const { email, password } = data;
            const token = await getUser(email, password);
            await setCookie('tokenAuth', token, { sameSite: 'lax', maxAge: 60 * 60 * 24 });
            router.push('/espace-utilisateur');
        }
        catch (error) { }

    };

    const handleInscription = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (!loading) {
            router.push('/connexion/inscription')
        }
    }

    return (
        <div className="w-full relative">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-3">
                    {/* EMAIL */}
                    <div className='w-full'>
                        <label className="border-[1px] w-full rounded-md hover:border-primary hover:shadow-lg focus-within:border-primary focus:outline-none px-2 py-1 focus:shadow-lg flex gap-2 items-center group transition duration-200">
                            <FaUser
                                size={15}
                                className="text-primary transition duration-200 group"
                            />
                            <input
                                type="text"
                                className="border-transparent focus:border-transparent w-full focus:outline-none group"
                                placeholder="Email"
                                {...register('email', {
                                    required: true, pattern: /^\S+@\S+$/i,
                                    maxLength: 50
                                })}
                            />
                        </label>
                        {errors.email?.type === "pattern" && (
                            <span className="text-red-500 text-xs">
                                Le mail doit être valide.
                            </span>
                        )}
                        {errors.email?.type === "required" && (
                            <span className="text-red-500 text-xs">
                                Le mail est obligatoire.
                            </span>
                        )}
                        {errors.email?.type === "maxLength" && (
                            <span className="text-red-500 text-xs">
                                Le mail est trop long.
                            </span>
                        )}
                    </div>
                    {/* Mot de Passe */}
                    <div className='w-full'>
                        <label className="border-[1px] w-full rounded-md hover:border-primary hover:shadow-lg focus-within:border-primary focus:outline-none px-2 py-1 focus:shadow-lg flex gap-2 items-center group transition duration-200">
                            <FaLock
                                size={15}
                                className="text-primary transition duration-200 group"
                            />
                            <input
                                type="password"
                                className="border-transparent focus:border-transparent w-full focus:outline-none group"
                                placeholder="Mot de passe"
                                {...(register('password', {
                                    required: true,
                                    pattern: /^[A-Za-z0-9!@#$%^&*()-_+=]+$/,
                                    maxLength: 30
                                }))}
                            />
                        </label>
                        {errors.password?.type === "required" && (
                            <span className="text-red-500 text-xs">
                                Le mot de passe est obligatoire
                            </span>
                        )}
                        {errors.password?.type === "maxLength" && (
                            <span className="text-red-500 text-xs">
                                Le mot de passe est trop long
                            </span>
                        )}
                        {errors.password?.type === "pattern" && (
                            <span className="text-red-500 text-xs">
                                Le mot de passe est mauvais
                            </span>
                        )}
                    </div>
                </div>
                {/* Connexion et Inscription */}
                <div className="flex max-md:flex-col justify-end gap-2 mt-6">
                    <button
                        className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {' '}
                        {loading ? (
                            <Spin spinning={loading} />
                        ) : (
                            <div className="flex justify-center items-center gap-3 text-white">
                                <p className="text-sm">Connexion</p>
                            </div>
                        )}
                    </button>
                    <button
                        className={`px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg ${loading && "bg-gray-500 hover:bg-gray-500 active:scale-100 cursor-not-allowed"}  cursor-pointer md:w-[150px] md:order-1`}
                        disabled={loading}
                        onClick={(event) => handleInscription(event)}
                    >
                        <div className="flex justify-center items-center gap-3 text-white">
                            <p className="text-sm">Inscription</p>
                        </div>

                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
