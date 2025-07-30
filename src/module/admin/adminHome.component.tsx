'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AdminMenu from '~/components/admin/admin.menu.component';
import { AdminMenuChoices } from './admin.utils';

const AdminHome = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variantsList = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const variantsItem = {
        hidden: { opacity: 0, y: 35 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div>
            <div className="text-center mt-2 mb-10">
                <h1 className="text-2xl font-bold">Panneau Administration</h1>
            </div>

            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="flex-col justify-center items-center mt-5 gap-10 pt-10 md:min-h-[500px] md:pl-[30%]"
            >
                {AdminMenuChoices.map((menu, index) => (
                    <motion.div variants={variantsItem} key={index}>
                        <AdminMenu {...menu} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AdminHome;
