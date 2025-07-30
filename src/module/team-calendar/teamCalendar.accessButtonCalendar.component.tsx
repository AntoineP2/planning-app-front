"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthenticationStore } from "../authentication/_store/authentication.store";
import { useCallback } from "react";

type TeamCalendarButtonProps = {
    userName: string;
    userId: string;
};

const TeamCalendarButton = ({ userName, userId }: TeamCalendarButtonProps) => {
    const { userRole } = useAuthenticationStore()
    const searchParams = useSearchParams()
    const router = useRouter()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
        )


    const handleClickCalendar = () => {
        router.push('../admin/configuration-utilisateur/calendrier-utilisateur/?' + createQueryString('userId', userId) + '&' + createQueryString('userName', userName))
    }
  return (
    <div>
        <button onClick={() => handleClickCalendar()} className="font-semibold" disabled={!userRole.includes("admin") && !userRole.includes("superAdmin")}>{userName}</button>
    </div>


  );
};

export default TeamCalendarButton;