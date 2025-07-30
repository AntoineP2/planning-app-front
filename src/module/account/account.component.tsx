"use client"
import { useEffect } from 'react'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuthenticationStore } from '../authentication/_store/authentication.store'
import { useAccountStore } from './_store/account.store'
import AccountMenu from './account-menu/accountMenu.component';
import { AccountMenuEnum } from './account.utils';
import AccountInfo from './account-info/accountInfo.component';
import AccountProfile from './account-profile/accountProfile.component';

const Account = () => {
    const { accountMenuSelected } = useAccountStore()

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

  return (
    <>
            <motion.div
                    ref={ref}
                    variants={variantsList}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="flex max-md:flex-col gap-5 w-[90%] md:items-start"
                >
                    <motion.div variants={variantsItem} className="md:flex-0 px-5 py-3 shadow-lg border rounded-lg">
                        <AccountMenu />
                    </motion.div>
                    <motion.div variants={variantsItem} className="md:flex-1 shadow-xl border mr-5 w-full rounded-lg px-5 py-2">
                            <motion.div
                                key={accountMenuSelected}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={formAnimation}
                            >  
                                {accountMenuSelected === AccountMenuEnum.PROFIL && <AccountInfo />}
                                {accountMenuSelected === AccountMenuEnum.CONFIG && <AccountProfile />}
                            </motion.div>
                    </motion.div>
                </motion.div>
        </>
  )
}

export default Account