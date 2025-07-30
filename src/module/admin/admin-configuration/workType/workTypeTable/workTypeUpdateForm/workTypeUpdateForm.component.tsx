'use client';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWorkTypeStore } from '../_store/workTypeForm.store';
import { WorkTypeFormType } from '../workTypeTable.utils';

const WorkTypeUpdateForm: React.FC = () => {
    const [workName, setWorkName] = useState<string>('');
    const [mondayHour, setMondayHour] = useState<number>(0);
    const [tuesdayHour, setTuesdayHour] = useState<number>(0);
    const [wednesdayHour, setWednesdayHour] = useState<number>(0);
    const [thursdayHour, setThursdayHour] = useState<number>(0);
    const [fridayHour, setFridayHour] = useState<number>(0);
    const {
        isLoading,
        selectedWorkType,
        updateWorkType,
        getWorkTypeList,
        setUpdateWorkTypeModalFormState,
    } = useWorkTypeStore();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<WorkTypeFormType>();

    const onSubmit: SubmitHandler<WorkTypeFormType> = async data => {
        const workHour = mondayHour + tuesdayHour + wednesdayHour + thursdayHour + fridayHour;
        await updateWorkType({
            id: selectedWorkType.id,
            name: workName ? workName : selectedWorkType.name,
            monday: mondayHour ? mondayHour.toString() : selectedWorkType.monday,
            tuesday: tuesdayHour ? tuesdayHour.toString() : selectedWorkType.tuesday,
            wednesday: wednesdayHour ? wednesdayHour.toString() : selectedWorkType.wednesday,
            thursday: thursdayHour ? thursdayHour.toString() : selectedWorkType.thursday,
            friday: fridayHour ? fridayHour.toString() : selectedWorkType.friday,
            weeklyHour: workHour ? workHour.toString() : selectedWorkType.weeklyHour,
        });
        getWorkTypeList();
        setUpdateWorkTypeModalFormState(false);
    };

    useEffect(() => {
        setWorkName(selectedWorkType.name);
        setMondayHour(parseFloat(selectedWorkType.monday));
        setTuesdayHour(parseFloat(selectedWorkType.tuesday));
        setWednesdayHour(parseFloat(selectedWorkType.wednesday));
        setThursdayHour(parseFloat(selectedWorkType.thursday));
        setFridayHour(parseFloat(selectedWorkType.friday));
    }, [selectedWorkType]);

    return (
        <div className=" w-full relative py-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col justify-center items-center gap-3 text-sm">
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-xl font-bold mb-6">Modification de la fonction <span className='text-primary'>{selectedWorkType.name}</span></h2>
                        <div className="flex justify-center flex-col items-start gap-5">
                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Nom : </p>
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={workName}
                                    onChange={e => setWorkName(e.target.value)}
                                    maxLength={20}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[50%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Lundi </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    value={mondayHour}
                                    onChange={e => setMondayHour(parseFloat(e.target.value))}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Mardi : </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    value={tuesdayHour}
                                    onChange={e => setTuesdayHour(parseFloat(e.target.value))}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Mercredi : </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    value={wednesdayHour}
                                    onChange={e => setWednesdayHour(parseFloat(e.target.value))}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Jeudi : </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    value={thursdayHour}
                                    onChange={e => setThursdayHour(parseFloat(e.target.value))}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Vendredi : </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    value={fridayHour}
                                    onChange={e => setFridayHour(parseFloat(e.target.value))}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>
                        </div>
                        {/* Enregistrer */}
                        <div className="flex justify-end w-full mt-10">
                            <button
                                className="px-4 py-3 shadow-lg bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
                                disabled={isLoading}
                            >
                                {' '}
                                {isLoading ? (
                                    <Spin spinning={isLoading} />
                                ) : (
                                    <div className="flex justify-center items-center gap-3 text-white">
                                        <p className="text-sm">Enregistrer</p>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default WorkTypeUpdateForm;
