'use client';

import { useCalendarStore } from "~/module/calendar/_store/calendar.store";

interface CustomButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const CustomButtonNavigate: React.FC<CustomButtonProps> = ({ onClick, children }) => {
    const { isLoading } = useCalendarStore();

    return (
        <button className="bg-primary px-5 hover:bg-primary-light font-semibold rounded shadow-md disabled:cursor-wait disabled:bg-slate-300 text-slate-50 max-md:text-sm" onClick={onClick} disabled={isLoading}>
            {children}
        </button>
    );
};

export default CustomButtonNavigate;
