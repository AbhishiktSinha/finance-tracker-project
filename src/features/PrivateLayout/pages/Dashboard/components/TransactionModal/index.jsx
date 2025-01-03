import { Tabs } from "antd";

// import AddExpenditureTransaction from './components/AddExpenditureTransaction'
// import AddIncomeTransaction from './components/AddIncomeTransaction'

import "./styles.css"
import { lazy, Suspense, useMemo } from "react";
import { DayJSUtils } from "../../../../../../dayjs"; 
import { UDPATE_PRIMARY_TRANSACTIONS } from "../../../../redux/actions/primaryTransactionsActions";
import { timeframe, transactionType } from "../../../../../../enums";
import { consoleDebug, consoleError, consoleInfo } from "../../../../../../console_styles";
import dayjs from "dayjs";

export default function TransactionModal({modalRef}) {
    
    
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

    const AddIncomeTransaction = lazy(()=>import('./components/AddIncomeTransaction'));
    const AddExpenditureTransaction = lazy(()=>import('./components/AddExpenditureTransaction'));

    const items = useMemo(()=>{
        return (
            [
                {
                    key: transactionType.INCOME,
                    label: 'Income',
                    children: <Suspense><AddIncomeTransaction onFinshDispatch={onFinshDispatch}/></Suspense>
                }, 
                {
                    key: transactionType.EXPENDITURE,
                    label: 'Expenditure',
                    children: <Suspense><AddExpenditureTransaction onFinishDispatch={onFinshDispatch}/></Suspense>
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