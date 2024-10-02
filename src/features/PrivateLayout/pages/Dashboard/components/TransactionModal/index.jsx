import { Tabs } from "antd";

// import AddExpenditureTransaction from './components/AddExpenditureTransaction'
// import AddIncomeTransaction from './components/AddIncomeTransaction'

import "./styles.css"
import { lazy, Suspense, useMemo } from "react";

export default function TransactionModal() {

    const AddIncomeTransaction = lazy(()=>import('./components/AddIncomeTransaction'));
    const AddExpenditureTransaction = lazy(()=>import('./components/AddExpenditureTransaction'));

    const items = useMemo(()=>{
        return (
            [
                {
                    key: 'incomeTab',
                    label: 'Income',
                    children: <Suspense><AddIncomeTransaction/></Suspense>
                }, 
                {
                    key: 'expenditureTab',
                    label: 'Expenditure',
                    children: <Suspense><AddExpenditureTransaction/></Suspense>
                }
            ]
        )
    }, []);

    return (
        <Tabs
            defaultActiveKey="incomeKey"
            items={items}
            animated={{inkBar: true, tabPane: true}}
            rootClassName="tab-selector"
        />
    )
}