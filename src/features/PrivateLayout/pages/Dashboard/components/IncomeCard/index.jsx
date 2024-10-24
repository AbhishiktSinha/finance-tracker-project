import { useSelector } from "react-redux";

import { selectNewTransaction_income, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { selectActiveTimeframe } from "../../redux/selectors"

import { asyncStatus, changeType, transactionType } from "../../../../../../enums";
import { useDynamicAmount, useInsightState } from "../../../../../../custom_hooks";
import { checkDisplayUI, getChangeType, getValueChangePercentage } from "../../../../utils";
import { consoleInfo } from "../../../../../../console_styles";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext } from "react";
import userAuthContext from "../../../../context/userAuthContext";


export default function IncomeCard() {

    const {uid} = useContext(userAuthContext);

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.INCOME)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransaction = useSelector(selectNewTransaction_income);

    const timeframe = useSelector(selectActiveTimeframe);
    

    consoleInfo(`INCOME CARD DEPENDENCIES:\n
        initializer: ${JSON.stringify(initializer)}\n
        defaultCurrency: ${JSON.stringify(defaultCurrency)}\n
        newTransactions: ${JSON.stringify(newTransaction)}
        timeframe: ${timeframe}`)

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransaction, 
        transactionType.INCOME);

    const showCardUI = checkDisplayUI([status]);

    const {status: insightsStatus, data: insightsData, error: insightsError} = useInsightState(
        uid, 
        timeframe, 
        transactionType.INCOME, 
        defaultCurrency.code)


    consoleInfo(`INSIGHT DATA IN INCOME CARD: \n
        status: ${insightsStatus}\n
        data: ${insightsData}\n
        error: ${insightsError}`)

    return (
        <DashboardTransactionCard 
            rootClassname='income-card'
            id={'income_card'}
            title={'INCOME'}
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
                        unit: '%'
                    } ,
                error: insightsError
            }}
        />
    )
}