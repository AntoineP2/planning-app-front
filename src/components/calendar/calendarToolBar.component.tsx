'use client';
import React from 'react';
import { ToolbarProps } from 'react-big-calendar';
import CustomButtonNavigate from './buttonNavigate.component';

const CustomToolbar: React.FC<ToolbarProps> = props => {

    const goToBack = () => {
        props.onNavigate('PREV');
    };

    const goToNext = () => {
        props.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        props.onNavigate('TODAY');
    };

    return (
        <div className="flex max-md:flex-col-reverse max-md:gap-2 justify-between items-center px-3 mb-2">
            <div className="flex max-md:gap-5 gap-2">
                <CustomButtonNavigate onClick={goToBack}>Précédent</CustomButtonNavigate>
                <CustomButtonNavigate onClick={goToCurrent}>Aujourd&apos;hui</CustomButtonNavigate>
                <CustomButtonNavigate onClick={goToNext}>Suivant</CustomButtonNavigate>
            </div>
            <span className="text-lg font-bold capitalize">{props.label}</span>
            <div className="flex gap-2"></div>
        </div>
    );
};

export default CustomToolbar;
