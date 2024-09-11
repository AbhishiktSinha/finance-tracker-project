import { useEffect, useRef, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx'

import privateContext from '../../context/index.jsx';

import OnboardingForm from './components/OnboardingForm/index.jsx'
import BalanceCard from './components/BalanceCard/index.jsx'

import { selectIsDefaultCurrencySet, selectStatus } from './redux/selectors.js'
import { consoleDebug, consoleError } from '../../../../console_styles/index.js';

import Skeleton from './components/Skeleton/index.jsx';
import { fetchUserDocThunk, updateExchangeRateThunk } from '../../redux/thunk.js';

import './stlyes.css';


export default function Dashboard() {

    const { user } = useContext(privateContext)

    /* TRANSACTION MODAL */
    const transactionModalRef = useRef();
    /*  ONBOARDING MODAL
    The onboardingModal is to be shown if the user has not
    selected the isDefaultCurrencySet (i.e not done the initial setup yet)
    */
    const onboardingModalRef = useRef();


    const handleButtonClick = (e) => {
        transactionModalRef.current.openModal();
    }

    // SELECTORS: Application State dependency
    const status = useSelector(selectStatus)
    const isDefaultCurrencySet = useSelector(selectIsDefaultCurrencySet)

    
    consoleDebug(`[DASHBOARD] | ${status} | defaultCurrency Set : ${isDefaultCurrencySet}`);

    const dispatch = useDispatch();
    
    useEffect(() => {
        // fetch userDOC from firestore post initial render
        if (status == 'initial') {
            dispatch(fetchUserDocThunk(user.uid));
        }
        // check necessity of onborading modal on success
        else if (status == 'success') {

            if (!Boolean(isDefaultCurrencySet)) {
                consoleError('DEFAULT CURRENCY NOT SET');
                onboardingModalRef.current.openModal();
            }
            else {
                consoleDebug(`Default Currency Set`);
                consoleDebug(`updating EXCHANGERATE from DASHBOARD post render | isDefaultCurrencySet ${isDefaultCurrencySet}`)
                
                // perform the update of exchange rate in the thunk 
                // to avoid direct defaultCurrency dependency
                // this thunk does not update the application state
                dispatch(updateExchangeRateThunk())
            }
        }

    }, [status])

    // SKELETON RENDER FOR INITIAL AND LOADING
    if (status == 'loading' || status == 'initial') {
        return <Skeleton />
    }

    return (
        <div id="dashboard-page">
            <h1>Dashboard</h1>

            <>
                <BalanceCard />

                <ModalWrapper
                    ref={onboardingModalRef}
                    maskClosable={false}
                    keyboard={false}
                >
                    <OnboardingForm modalRef={onboardingModalRef} />
                </ModalWrapper>

                <ModalWrapper
                    ref={transactionModalRef}
                >
                    {
                        /* TODO: modal contents jsx goes here 
                        modal to add transactions, 
                        use Tabs for INCOME and EXPENDITURE
                        */
                    }
                </ModalWrapper>

                <Button
                    className='add-txn-button'
                    size='large'
                    shape='circle'
                    icon={<PlusOutlined />}
                    onClick={handleButtonClick}
                >
                </Button>
            </>

        </div>
    )
}