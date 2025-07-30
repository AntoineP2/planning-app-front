'use client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PieChartPresence from '~/components/chart/pieChart.presence.component';
import HomeMenu from '~/components/home/home.menu.component';
import { homeMenuChoicesCollaborator } from './home.utils';

const Home = () => {
    const date = new Date();
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
            <div>
                <h1 className="text-center mt-5 text-2xl font-bold capitalize">
                    Idealys Planning -{' '}
                    {format(date, 'EEEE dd MMMM yyyy', { locale: fr })}
                </h1>
            </div>
            <div className="hidden">
                <PieChartPresence />
            </div>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="flex max-md:flex-col justify-center items-center mt-5 gap-5"
            >
                {homeMenuChoicesCollaborator.map((menu, index) => (
                    <motion.div variants={variantsItem} key={index}>
                        <HomeMenu {...menu} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Home;
