import { useEffect, useRef, useContext } from 'react';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../components_common/ModalWrapper'

import privateContext from '../PrivateLayout/context';

import OnboardingForm from './components/OnboardingForm/index.jsx'
import BalanceCard from './components/BalanceCard/index.jsx'

import { getUserDoc } from './firebase';
import { consoleDebug, consoleError } from '../../console_styles';

import './stlyes.css';

export default function Dashboard() {
    
    consoleDebug('Dashboard page rendered');
    const {user} = useContext(privateContext)

    const transactionModalRef = useRef();
    const handleButtonClick= (e)=> {
        transactionModalRef.current.openModal();
    }
    
    /*  ONBOARDING MODAL
        The onboardingModal is to be shown if the user has not
        selected the defaultCurrency (i.e not done the initial setup yet)

        To check that, we have to retrieve user details from the user's doc, 
        which is an asynchronous operation, so we'll perform that in a
        useEffect
    */
    const onboardingModalRef = useRef();
    useEffect(()=>{
        (
            async function() {
                const userDoc = await getUserDoc(user.uid);
                
                const { settings: {defaultCurrency} } = userDoc;

                if (!Boolean(defaultCurrency)) {
                    consoleError('DEFAULT CURRENCY NOT SET');
                    onboardingModalRef.current.openModal();
                }
                else {
                    consoleDebug(`Default Currency: ${defaultCurrency}`);
                }
            }
        )()

    }, [])

    return (
        <div id="dashboard-page">
            <h1>Dashboard</h1>
            <BalanceCard/>

            <ModalWrapper 
                ref={onboardingModalRef}
                maskClosable={false}
                keyboard={false}
            >   
                <OnboardingForm modalRef={onboardingModalRef}/>
            </ModalWrapper>
            
            <ModalWrapper
                ref={transactionModalRef}
            >
                {/* TODO: modal contents jsx goes here 
                    modal to add transactions, 
                    use Tabs for INCOME and EXPENDITURE
                */}    
            </ModalWrapper>
            
            <Button
                className='add-txn-button'
                size='large'
                shape='circle'
                icon={<PlusOutlined/>}
                onClick={handleButtonClick}
            >
            </Button>
        </div>
    )
}