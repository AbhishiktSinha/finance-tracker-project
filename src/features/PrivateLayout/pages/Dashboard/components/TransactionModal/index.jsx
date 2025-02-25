import { Tabs } from "antd";

// import AddExpenditureTransaction from './components/AddExpenditureTransaction'
// import AddIncomeTransaction from './components/AddIncomeTransaction'

import "./styles.css"
import { lazy, Suspense, useContext, useMemo } from "react";
import { DayJSUtils } from "../../../../../../dayjs"; 
import { UDPATE_PRIMARY_TRANSACTIONS } from "../../../../redux/actions/primaryTransactionsActions";
import { timeframe, transactionOperations, transactionType } from "../../../../../../enums";
import { consoleDebug, consoleError, consoleInfo } from "../../../../../../console_styles";
import dayjs from "dayjs";
import latestTransactionContext from "../../context/LatestTransactionContext";
import { useDispatch } from "react-redux";
import { createTransactionThunk } from "../../../../redux/thunk";
import userAuthContext from "../../../../context/userAuthContext";

export default function CreateTransactionModal({modalRef}) {
    
    
    const onFinshDispatch = (dispatch, transactionData)=>{
        consoleDebug('ATTEMPTING Redux DashboardTransaction State udpate');
        
        const { data: { timestamp: {occurredAt } } } = transactionData;

        if (DayJSUtils.isWithinTimeframe(timeframe.YEAR, occurredAt)) {

            const {ADD_PRIMARY_TRANSACTION} = UDPATE_PRIMARY_TRANSACTIONS;
            consoleInfo('dispatch -> ADD_PRIMARY_TRANSACTION')
            dispatch({
                type: ADD_PRIMARY_TRANSACTION, 
                payload: transactionData
            })
        }
        else {
            consoleError(`occurredAt timestamp: ${occurredAt +" | "+ dayjs(occurredAt).date()} \n
            does not lie within YEAR: `)
        }
        
    }

    const {latestTransaction, setLatestTransaction} = useContext(latestTransactionContext)
    const {user: {uid}} = useContext(userAuthContext);
    const dispatch = useDispatch();

    async function onFinishAction(formFields, modifiedFields) {

        const latest_transaction_update = (transactionObject)=>{

            consoleInfo(`updating latest transaction [CREATION] ---> ${transactionObject.data.title}`)
            
            setLatestTransaction({
                id: transactionObject.id, 
                transactionOperation: transactionOperations.CREATION, 
                transactionData: transactionObject.data
            })
        }

        await dispatch(createTransactionThunk(uid, formFields, modifiedFields, latest_transaction_update))
    }


    const AddIncomeTransaction = lazy(()=>import('./components/AddIncomeTransaction'));
    const AddExpenditureTransaction = lazy(()=>import('./components/AddExpenditureTransaction'));

    const items = useMemo(()=>{
        return (
            [
                {
                    key: transactionType.INCOME,
                    label: 'Income',
                    children: <Suspense><AddIncomeTransaction onFinishAction={onFinishAction}/></Suspense>
                }, 
                {
                    key: transactionType.EXPENDITURE,
                    label: 'Expenditure',
                    children: <Suspense><AddExpenditureTransaction onFinishAction={onFinishAction}/></Suspense>
                }
            ]
        )
    }, []);

    return (
        <Tabs
            defaultActiveKey={transactionType.INCOME}
            items={items}
            animated={{inkBar: true, tabPane: true}}
            rootClassName="tab-selector"
        />
    )
}