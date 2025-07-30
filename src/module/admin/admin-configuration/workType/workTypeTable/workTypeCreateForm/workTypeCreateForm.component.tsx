'use client';
import { Spin } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useWorkTypeStore } from '../_store/workTypeForm.store';
import { WorkTypeFormType } from '../workTypeTable.utils';

const WorkTypeCreateForm: React.FC = () => {
    const { isLoading, createWorkType, getWorkTypeList, setCreateWorkTypeModaleState } = useWorkTypeStore();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<WorkTypeFormType>();

    const onSubmit: SubmitHandler<WorkTypeFormType> = async data => {
        const { name, friday, monday, thursday, tuesday, wednesday } = data;
        const weeklyHour = parseFloat(monday.toString()) + parseFloat(tuesday.toString()) + parseFloat(wednesday.toString()) + parseFloat(thursday.toString()) + parseFloat(friday.toString());
        await createWorkType(
            name,
            weeklyHour.toString(),
            monday.toString(),
            tuesday.toString(),
            wednesday.toString(),
            thursday.toString(),
            friday.toString()
        );
        getWorkTypeList();
        setCreateWorkTypeModaleState(false);
    };

    return (
        <div className=" w-full relative py-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex max-md:flex-col justify-center items-center gap-3 text-sm">
                    <div className="w-[90%] border bg-white shadow-lg rounded-lg p-5">
                        <h2 className="text-xl font-bold mb-6">Créer une nouvelle fonction</h2>
                        <div className="flex justify-center flex-col items-start gap-5">
                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Nom : </p>
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    {...register('name', { required: 'Ce champ est requis' })}
                                    maxLength={20}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[50%] w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center px-5 w-full">
                                <p className="text-lg">Lundi </p>
                                <input
                                    type="number"
                                    placeholder="horaires"
                                    defaultValue={0}
                                    {...register('monday', { required: 'Ce champ est requis' })}
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
                                    defaultValue={0}
                                    {...register('tuesday', { required: 'Ce champ est requis' })}
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
                                    defaultValue={0}
                                    {...register('wednesday', { required: 'Ce champ est requis' })}
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
                                    defaultValue={0}
                                    {...register('thursday', { required: 'Ce champ est requis' })}
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
                                    defaultValue={0}
                                    {...register('friday', { required: 'Ce champ est requis' })}
                                    min={0}
                                    max={100}
                                    step={0.5}
                                    className="bg-white border border-gray-300 rounded-lg py-3 flex justify-center items-center shadow-md text-center focus:border-primary focus:outline-none disabled:bg-slate-300 disabled:text-slate-400 md:w-[30%] w-full"
                                />
                            </div>
                            <div className="flex justify-end w-full mt-10">
                                {/* Enregistrer */}
                                <button
                                    className="px-4 py-3 bg-gradient-to-b from-primary to-primary-dark hover:bg-gradient-to-t transition duration-150 ease-in-out active:scale-95 rounded-lg disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:active:scale-100 disabled:cursor-not-allowed md:w-[150px] md:order-2"
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
                </div>
            </form>
        </div>
    );
};
export default WorkTypeCreateForm;
