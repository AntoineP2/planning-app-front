'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useUserListStore } from './user-list/_store/userList.store';
import UserList from './user-list/userList.component';
import UserUpdateForm from './user-update-form/userUpdateForm.component';
import { useEffect } from 'react';

const Configuration = () => {
    const { selectedUser, resetSelectedUser } = useUserListStore();
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
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
    };

    const formAnimation = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    };

    useEffect(() => {
        resetSelectedUser();
    }, [resetSelectedUser])

    return (
        <>
            <motion.div
                ref={ref}
                variants={variantsList}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="flex max-md:flex-col gap-5 w-full"
            >
                <motion.div variants={variantsItem} className="md:flex-0">
                    <UserList />
                </motion.div>
                <motion.div variants={variantsItem} className="md:flex-1 shadow-xl border mr-5">
                {selectedUser ? (
                        <motion.div
                            key={selectedUser.id}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={formAnimation}
                        >
                            <UserUpdateForm />
                        </motion.div>
                    ) : (
                        <div className="flex justify-center items-center h-full text-xl font-semibold">
                            Sélectionner un Utilisateur
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </>
    );
};

export default Configuration;
