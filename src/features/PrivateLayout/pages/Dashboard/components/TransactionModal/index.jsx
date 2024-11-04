import { Tabs } from "antd";

// import AddExpenditureTransaction from './components/AddExpenditureTransaction'
// import AddIncomeTransaction from './components/AddIncomeTransaction'

import "./styles.css"
import { lazy, Suspense, useMemo } from "react";
import { UDPATE_DASHBOARD_TRANSACTIONS } from "../../redux/actions/dashboardTransactionsActions";
import { transactionType } from "../../../../../../enums";
import { consoleDebug } from "../../../../../../console_styles";

export default function TransactionModal() {
    const onFinshDispatch = (dispatch, data)=>{
        consoleDebug('ATTEMPTING Redux DashboardTransaction State udpate');
        const {ADD_DASHBOARD_TRANSACTION} = UDPATE_DASHBOARD_TRANSACTIONS;
        dispatch({
            type: ADD_DASHBOARD_TRANSACTION, 
            payload: data
        })
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
                    children: <Suspense><AddExpenditureTransaction/></Suspense>
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