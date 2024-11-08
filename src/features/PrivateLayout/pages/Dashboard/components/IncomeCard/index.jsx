import { useSelector } from "react-redux";

import { selectNewTransactionData_income, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { selectActiveTimeframe } from "../../redux/selectors"

import { asyncStatus, changeType, transactionType } from "../../../../../../enums";
import useInsightState from "../../../../../../custom_hooks/useInsightState";
import useDynamicAmount from "../../../../../../custom_hooks/useDynamicAmount";
import { checkDisplayUI, getChangeType, getValueChangePercentage } from "../../../../utils";
import { consoleDebug, consoleInfo } from "../../../../../../console_styles";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext } from "react";
import userAuthContext from "../../../../context/userAuthContext";


export default function IncomeCard() {

    consoleDebug(`------- INCOME CARD RENDERED ------`)

    const {user: {uid} } = useContext(userAuthContext);

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.INCOME)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransactionData = useSelector(selectNewTransactionData_income);

    const timeframe = useSelector(selectActiveTimeframe);
    

    consoleInfo(`INCOME CARD DEPENDENCIES:\n
        initializer: ${JSON.stringify(initializer)}\n
        defaultCurrency: ${JSON.stringify(defaultCurrency)}\n
        newTransactions: ${JSON.stringify(newTransactionData)}
        timeframe: ${timeframe}`)

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransactionData, 
        transactionType.INCOME);

    const showCardUI = checkDisplayUI([status]);

    return (
        <DashboardTransactionCard 
            rootClassname='income-card'
            id={'income_card'}
            title={'INCOME'}
            showUI={showCardUI}
            data={{
                defaultCurrency: defaultCurrency, 
                amount: amount, 
                timeframe: timeframe,
                type: transactionType.INCOME
            }}

            insights={{
                defaultCurrencyCode: defaultCurrency.code, 
                aggregateTransactionAmt: amount, 
                type: transactionType.INCOME,
                activeTimeframe: timeframe
            }}
        />
    )
}