import { useSelector } from "react-redux";

import { selectNewTransactionData_wrapper, selectTransactionsInitializer_wrapper } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";

import { transactionType } from "../../../../../../enums";
import useDynamicAmount from "../../../../../../custom_hooks/useDynamicAmount";
import { checkDisplayUI } from "../../../../utils";
import { consoleDebug, consoleInfo } from "../../../../../../console_styles";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext, useMemo } from "react";
import userAuthContext from "../../../../context/userAuthContext";
import activeTimeframeContext from "../../context/ActiveTimeframeContext";


export default function IncomeCard() {

    consoleDebug(`------- INCOME CARD RENDERED ------`)

    const {activeTimeframe: timeframe} = useContext(activeTimeframeContext)

    // always a new reference due to filtering the list of transactions
    const initializer = useSelector(
        selectTransactionsInitializer_wrapper(transactionType.INCOME, timeframe)
    );
    const newTransactionData = useSelector(
        selectNewTransactionData_wrapper(transactionType.INCOME, timeframe)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);    

    

    consoleInfo(`INCOME CARD DEPENDENCIES:\n
        initializer: ${JSON.stringify(initializer)}\n
        defaultCurrency: ${JSON.stringify(defaultCurrency)}\n
        newTransactions: ${JSON.stringify(newTransactionData)}
        timeframe: ${timeframe}`)

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransactionData, 
        transactionType.INCOME,
        timeframe);

    const showCardUI = checkDisplayUI([status]);

    const card_data = useMemo(()=>{
        return {
            defaultCurrency: defaultCurrency, 
            amount: amount, 
            timeframe: timeframe,
        }
    }, [defaultCurrency, amount, timeframe])

    const insight_data = useMemo(()=>{
        return {
            aggregateTransactionAmt: amount, 
            defaultCurrencyCode: defaultCurrency.code, 
            activeTimeframe: timeframe
        }
    }, [amount, defaultCurrency.code, timeframe])


    return (
        <DashboardTransactionCard 
            rootClassname='income-card'
            id={'income_card'}
            title={'INCOME'}
            showUI={showCardUI}
            data={card_data}

            insights={insight_data}
        />
    )
}