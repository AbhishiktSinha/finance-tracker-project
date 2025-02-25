import { useContext } from 'react';
import { useSelector } from 'react-redux'

import { selectRecentTransactionsList_wrapper } from '../../redux/selectors'

import activeTimeframeContext from '../../context/ActiveTimeframeContext';
import latestTransactionContext from '../../context/LatestTransactionContext';

import TransactionCardHorz from '../../../../components/TransactionCardHorz';
import EmptyBoxImage from '../../../../../../components_common/EmptyBoxImage';

import { transactionOperations } from '../../../../../../enums';
import './styles.scss'

export default function DashboardRecentTransactions() {
    

    const {activeTimeframe} = useContext(activeTimeframeContext)
    const {setLatestTransaction} = useContext(latestTransactionContext)
    
    const recentTransactionsList = useSelector(
        selectRecentTransactionsList_wrapper(activeTimeframe));

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
                recentTransactionsList.length > 0 ? recentTransactionsList.map(
                    (transactionObj)=>{
                        return (
                            <TransactionCardHorz 
                                key={transactionObj.id}
                                transactionObj={transactionObj}
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