import { useRef, useContext, useEffect } from 'react'

import { useSelector } from 'react-redux'

import statusContext from '../StateInitializer/context';
import onboardingStatusContext from './context';

import ModalWrapper from '../../../../components_common/ModalWrapper';

import { consoleDebug, consoleError } from '../../../../console_styles';
import { selectIsDefaultCurrencySet } from './redux/selectors';
import OnboardingForm from './components/OnboardingForm';
import { asyncStatus } from '../../../../enums';


export default function OnboardingAction({ children }) {

    const {status} = useContext(statusContext);

    const isDefaultCurrencySet = useSelector(selectIsDefaultCurrencySet);

    consoleDebug(`ONBOARDINGaCTIONS status: ${status} | isDefaultCurrencySet: ${isDefaultCurrencySet}`);

    /*  ONBOARDING MODAL
   The onboardingModal is to be shown if the user has not
   selected the isDefaultCurrencySet (i.e not done the initial setup yet)
   */
    const onboardingModalRef = useRef();

    useEffect(() => {
        // check necessity of onborading modal on success
        if (status == asyncStatus.SUCCESS) {

            // onboarding not done
            if (!Boolean(isDefaultCurrencySet)) {
                consoleError('DEFAULT CURRENCY NOT SET');
                onboardingModalRef.current.openModal();
            }            
            else {
                consoleDebug(`Default Currency Set`);
            }
        }

    }, [status])

    return (
        <onboardingStatusContext.Provider value={{isOnboardingDone: isDefaultCurrencySet}}>
            < ModalWrapper
                ref={onboardingModalRef}
                maskClosable={false}
                keyboard={false}
            >
                <OnboardingForm modalRef={onboardingModalRef} />
            </ModalWrapper >

            {children}
        </onboardingStatusContext.Provider>
    )
}