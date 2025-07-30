"use client"
import { setCookie } from 'cookies-next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Authentication from '~/module/authentication/authentication.component';

const SSOPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userToken = searchParams.get('token') || '';

    useEffect(() => {
        if (userToken) {
            setCookieFunction(userToken);
            router.push('/espace-utilisateur');
            toast.success('Connexion réussie');
        }else{
            router.push('/connexion');
        }
    },[router, userToken])

    const setCookieFunction = async (token: string) => {
        await setCookie('tokenAuth', token, { sameSite: 'lax', maxAge: 60 * 60 * 24 });
    }
    return (
        <>
            <div className="flex justify-center items-center gap-3 h-full">
                <p>Chargement...</p>
            </div>
        </>
    );
};

export default SSOPage;
