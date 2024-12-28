import { useSelector } from "react-redux";
import { selectNewTransactionData_wrapper, selectTransactionsInitializer_wrapper } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";

import { transactionType } from "../../../../../../enums";
import useDynamicAmount from "../../../../../../custom_hooks/useDynamicAmount";
import { checkDisplayUI } from "../../../../utils";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext, useMemo } from "react";
import { consoleDebug, consoleInfo } from "../../../../../../console_styles";
import activeTimeframeContext from "../../context/ActiveTimeframeContext";


export default function ExpenditureCard() {

    consoleDebug(`--------- EXPENDITURE CARD RENDERED ------`);
    const {activeTimeframe: timeframe} = useContext(activeTimeframeContext)

    const initializer = useSelector(
        selectTransactionsInitializer_wrapper(transactionType.EXPENDITURE, timeframe)
    )
    const newTransactionData = useSelector(
        selectNewTransactionData_wrapper(transactionType.EXPENDITURE, timeframe)
    );
    const defaultCurrency = useSelector(selectDefaultCurrency);


    consoleInfo(`EXPENDITURE CARD DEPENDENCIES:\n
        initializer: ${JSON.stringify(initializer)}\n
        defaultCurrency: ${JSON.stringify(defaultCurrency)}\n
        newTransactions: ${JSON.stringify(newTransactionData)}
        timeframe: ${timeframe}`)



    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransactionData, 
        transactionType.EXPENDITURE, 
        timeframe);

    const showCardUI = checkDisplayUI([status]);


    /* ----------------- UI OPTIMISATIONS FOR MEMOIZED COMPONENT ------------------- */
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
            rootClassname='expenditure-card'
            id={'expenditure_card'}
            title={'EXPENDITURE'}
            showUI={showCardUI}
            /* data={{
                defaultCurrency: defaultCurrency, 
                amount: amount, 
                timeframe: timeframe,
                type: transactionType.EXPENDITURE
            }} */

            data={card_data}
            insights={insight_data}

            /* insights={{
                aggregateTransactionAmt: amount, 
                defaultCurrencyCode: defaultCurrency.code,
                activeTimeframe: timeframe, 
                type: transactionType.EXPENDITURE,
            }} */
        />
    )
}