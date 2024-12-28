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

import { checkDisplayUI } from '../../utils.js';

import './stlyes.scss';
import BalanceOverviewChartCard from './components/BalanceOverviewChartCard/index.jsx';
import DashboardRecentTransactions from './components/RecentTransactionsList/index.jsx'
import ActiveTimeframeContextProvider from './context/ActiveTimeframeContext/Provider.jsx';

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

    const showUI = checkDisplayUI([initialStateStatus], isOnboardingDone);

    /* TRANSACTION MODAL */
    const transactionModalRef = useRef();
    const handleButtonClick = (e) => {
        transactionModalRef.current.openModal();
    }

    // CONDITIONAL SKELETON RENDER
    if (!showUI) {
        return <Skeleton />
    }

    /* -------------------------------------------------------------------- */
    
    const TransactionModal = lazy(()=>import('./components/TransactionModal'));

    return (
        <ActiveTimeframeContextProvider >

            <div id="dashboard-page" className='route-page'>
                <h1 style={{ width: '100%' }}>Dashboard</h1>

                <div className='page-contents-wrapper'>

                    <div className="dashboard-content-row balance-and-overview-row">
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


                    <ModalWrapper
                        ref={transactionModalRef}
                    >
                        {/* <Suspense>
                            <TransactionModal
                                modalRef={transactionModalRef}
                            />
                        </Suspense> */}

                        <h2>This is the Modal Content</h2>

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

        </ActiveTimeframeContextProvider>
    )
}