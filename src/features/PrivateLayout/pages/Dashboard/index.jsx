import { useEffect, useRef, useContext, lazy, Suspense } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx'

import privateContext from "../../context/userAuthContext/index.jsx";
import statusContext from '../../components/StateInitializer/context.jsx';
import onboardingStatusContext from '../../components/OnboardingAction/context'

import BalanceCard from './components/BalanceCard/index.jsx'
import IncomeCard from './components/IncomeCard';
import ExpenditureCard from './components/ExpenditureCard'

import Skeleton from './components/Skeleton/index.jsx';

import { fetchDashboardTransactionsThunk } from './redux/thunk.js';
import { checkDisplayUI } from '../../utils.js';
import { selectDashboardTransactionStatus } from './redux/selectors.js';

import './stlyes.css';

/*TODO: 
Redux to handle the Dashboard internal state of `dashboardTransactions`
Allow the user to change the timeframe of the dashboard page
 */
/*TODO:
    Generalize the functionality of conditionally showing the skeleton
    vs showing the UI, based on userDoc status, any other status, and isOnboardingDone,
    as a custom hook to be available to all routes.
*/
export default function Dashboard() {

    const dispatch = useDispatch();

    const { user } = useContext(privateContext)
    
    // STATUS to handle the initial loading uis
    const { status: initialStateStatus } = useContext(statusContext);
    const { isOnboardingDone } = useContext(onboardingStatusContext)
    const dashboardTransactionsStatus = useSelector(selectDashboardTransactionStatus)

    const showUI = checkDisplayUI([
        initialStateStatus, 
        dashboardTransactionsStatus], isOnboardingDone);

    /* TRANSACTION MODAL */
    const transactionModalRef = useRef();
    const handleButtonClick = (e) => {
        transactionModalRef.current.openModal();
    }
    
    // initialize dashboard state
    useEffect(()=>{
        if (dashboardTransactionsStatus == 'initial') {
            dispatch(fetchDashboardTransactionsThunk(user.uid))
        }
        
    }, [])


    // CONDITIONAL SKELETON RENDER
    if (!showUI) {
        return <Skeleton />
    }

    /* -------------------------------------------------------------------- */
    
    const TransactionModal = lazy(()=>import('./components/TransactionModal'));
    return (
        <div id="dashboard-page">
            <h1>Dashboard</h1>

            <>
                <div className="transaction-cards-container">
                    <BalanceCard />

                    <div className="income-expenditure-container">
                        <IncomeCard/>
                        <ExpenditureCard />
                    </div>
                </div>

                <ModalWrapper
                    ref={transactionModalRef}
                >
                    <Suspense><TransactionModal/></Suspense>
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