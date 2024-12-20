import { useEffect, useRef, useContext, lazy, Suspense } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx'

import userAuthContext from "../../context/userAuthContext/index.jsx";
import statusContext from '../../components/StateInitializer/context.jsx';
import onboardingStatusContext from '../../components/OnboardingAction/context'

import BalanceCard from './components/BalanceCard/index.jsx'
import IncomeCard from './components/IncomeCard';
import ExpenditureCard from './components/ExpenditureCard'

import Skeleton from './components/Skeleton/index.jsx';

import { fetchDashboardTransactionsThunk } from './redux/thunks.js';
import { checkDisplayUI } from '../../utils.js';
import { selectDashboardTransactionStatus } from './redux/selectors.js';

import './stlyes.css';
import BalanceOverviewChartCard from './components/BalanceOverviewChartCard/index.jsx';
import DashboardRecentTransactions from './components/DashboardRecentTransactions/index.jsx'

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

    const { user } = useContext(userAuthContext)
    
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
        <div id="dashboard-page" className='route-page'>
            <h1 style={{width: '100%'}}>Dashboard</h1>

            <div className='page-contents-wrapper'>

                <div className="dashboard-content-row">
                    <BalanceCard />
                    <BalanceOverviewChartCard />
                </div>

                <div className="dashboard-content-row income-expenditure-row">
                    <IncomeCard />
                    <ExpenditureCard />
                </div>
                
                <div className="dashboard-content-row recent-transactions-row">
                    <DashboardRecentTransactions />
                </div>
                {/* <div className="transaction-cards-container">
                    <BalanceCard />

                    <div className="income-expenditure-container">
                        <IncomeCard/>
                        <ExpenditureCard />
                    </div>
                </div> */}

                <ModalWrapper
                    ref={transactionModalRef}
                >
                    <Suspense>
                        <TransactionModal
                            modalRef={transactionModalRef}
                        />
                    </Suspense>

                </ModalWrapper>

                <Button
                    className='add-txn-button'
                    size='large'
                    shape='circle'
                    icon={<PlusOutlined />}
                    onClick={handleButtonClick}
                >
                </Button>
            </div>

        </div>
    )
}