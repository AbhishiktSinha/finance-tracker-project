import { useEffect, useRef, useContext } from 'react';

import { useSelector } from 'react-redux';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx'

import privateContext from '../../context/index.jsx';

import OnboardingForm from './components/OnboardingForm/index.jsx'
import BalanceCard from './components/BalanceCard/index.jsx'

import { getUserDoc } from './firebase.js';
import {defaultCurrencySelector} from './redux/selectors.js'
import { consoleDebug, consoleError } from '../../../../console_styles/index.js';

import './stlyes.css';

export default function Dashboard() {
    
    consoleDebug('Dashboard page rendered');
    const {user} = useContext(privateContext)

    const transactionModalRef = useRef();
    const handleButtonClick= (e)=> {
        transactionModalRef.current.openModal();
    }

    const defaultCurrency = useSelector(defaultCurrencySelector)
    
    /*  ONBOARDING MODAL
        The onboardingModal is to be shown if the user has not
        selected the defaultCurrency (i.e not done the initial setup yet)
    */
    const onboardingModalRef = useRef();
    useEffect(()=>{        
        
        if (!Boolean(defaultCurrency)) {
            consoleError('DEFAULT CURRENCY NOT SET');
            onboardingModalRef.current.openModal();
        }
        else {
            consoleDebug(`Default Currency: ${defaultCurrency}`);
        }

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