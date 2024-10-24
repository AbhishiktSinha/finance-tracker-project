import { useSelector } from "react-redux";
import { selectNewTransaction_expenditure, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { selectActiveTimeframe } from "../../redux/selectors";

import { changeType, transactionType } from "../../../../../../enums";
import { useDynamicAmount, useInsightState } from "../../../../../../custom_hooks";
import { checkDisplayUI, getChangeType, getValueChangePercentage } from "../../../../utils";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext } from "react";
import userAuthContext from "../../../../context/userAuthContext";


export default function ExpenditureCard() {

    const {uid} = useContext(userAuthContext)

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.EXPENDITURE)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransaction = useSelector(selectNewTransaction_expenditure);

    const timeframe = useSelector(selectActiveTimeframe);

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransaction, 
        transactionType.EXPENDITURE);

    const showCardUI = checkDisplayUI([status]);

    const {status: insightsStatus, 
        data: insightsData, 
        error: insightsError} = useInsightState(
            uid,
            timeframe, 
            transactionType.EXPENDITURE, 
            defaultCurrency.code, 
        )

    return (
        <DashboardTransactionCard 
            rootClassname='expenditure-card'
            id={'expenditure_card'}
            title={'EXPENDITURE'}
            showUI={showCardUI}
            data={{
                defaultCurrency: defaultCurrency, 
                amount: amount, 
                timeframe: timeframe
            }}

            insights={{
                status: insightsStatus, 
                data: insightsData == undefined ? 
                undefined: 
                {
                    changeType: getChangeType(insightsData, amount), 
                    value: getValueChangePercentage(insightsData, amount), 
                    unit: '%',
                }, 
                error: insightsError
            }}
        />
    )
}