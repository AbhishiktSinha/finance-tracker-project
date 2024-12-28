import { useSelector } from 'react-redux'
import { selectRecentTransactionsList_wrapper } from '../../redux/selectors'
import activeTimeframeContext from '../../context/ActiveTimeframeContext';

import './styles.scss'
import { useContext } from 'react';
import TransactionCardHorz from '../../../../components/TransactionCardHorz';

export default function DashboardRecentTransactions() {
    

    const {activeTimeframe} = useContext(activeTimeframeContext)
    
    const recentTransactionsList = useSelector(
        selectRecentTransactionsList_wrapper(activeTimeframe));

    return (
        <div className="dashboard-recent-transactions-container">
            <h2 className="section-title">Your Recent Transactions</h2>
            {
                recentTransactionsList.map(
                    (transactionObj)=>{
                        return (
                            <TransactionCardHorz 
                                key={transactionObj.id}
                                transactionObj={transactionObj}
                            />
                        )
                    }
                )
            }
        </div>
    )
}