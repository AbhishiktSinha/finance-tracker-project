import { useContext } from 'react';
import { useSelector } from 'react-redux'

import { wrapper_selectRecentTransactionsIdList } from '../../redux/selectors'

import activeTimeframeContext from '../../context/ActiveTimeframeContext';
import latestTransactionContext from '../../context/LatestTransactionContext';

import EmptyBoxImage from '../../../../../../components_common/EmptyBoxImage';

import { transactionOperations } from '../../../../../../enums';
import './styles.scss'
import TransactionCard from '../../../../components/TransactionUI/TransactionCard';
import { reduxSliceKeys } from '../../../../defaults';
import { DayJSUtils } from '../../../../../../dayjs';
import defaults from '../../defaults';

export default function DashboardRecentTransactions() {
    

    const {activeTimeframe} = useContext(activeTimeframeContext)
    const {setLatestTransaction} = useContext(latestTransactionContext)
    
    // const recentTransactionsIdList = useSelector(
    //     selectRecentTransactionsList_wrapper(activeTimeframe));

    const recentTransactionsIdList = useSelector(
        wrapper_selectRecentTransactionsIdList(activeTimeframe, defaults.maxRecentTransactions))

    const onEdit = ({ id, data, modifiedFields }) => {
        setLatestTransaction({
            id: id,
            transactionOperation: transactionOperations.MODIFICATION,
            transactionData: data,
            modifiedFields: modifiedFields
        })
    }
    const onDelete = ({id, data})=>{

        setLatestTransaction({
            id: id, 
            transactionData: data, 
            transactionOperation: transactionOperations.DELETION,                 
        })
    }


    return (
        <div className="dashboard-recent-transactions-container">
            <h2 className="section-title">Your Recent Transactions</h2>
            {
                recentTransactionsIdList.length > 0 ? recentTransactionsIdList.map(
                    (id)=>{
                        return (
                            <TransactionCard 
                            key={id}
                            id={id}                            
                            onEdit={onEdit}
                            onDelete={onDelete}
                            />
                        )
                    }
                ) :
                (
                    <div className="no-transactions-container">
                        <EmptyBoxImage />
                        <p>No transactions found for this {activeTimeframe}</p>                        
                    </div>
                )
            }
        </div>
    )
}