import { useSelector } from "react-redux";
import { selectNewTransactionData_expenditure, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { selectActiveTimeframe } from "../../redux/selectors";

import { changeType, transactionType } from "../../../../../../enums";
import useInsightState from "../../../../../../custom_hooks/useInsightState";
import useDynamicAmount from "../../../../../../custom_hooks/useDynamicAmount";
import { checkDisplayUI, getChangeType, getValueChangePercentage } from "../../../../utils";

import DashboardTransactionCard from "../DashboardTransactionCard";
import { useContext } from "react";
import userAuthContext from "../../../../context/userAuthContext";
import { consoleDebug } from "../../../../../../console_styles";


export default function ExpenditureCard() {

    consoleDebug(`--------- EXPENDITURE CARD RENDERED ------`);

    const {uid} = useContext(userAuthContext)

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.EXPENDITURE)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransactionData = useSelector(selectNewTransactionData_expenditure);

    const timeframe = useSelector(selectActiveTimeframe);

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransactionData, 
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
                    changeType: getChangeType(insightsData.amount, amount), 
                    value: getValueChangePercentage(insightsData.amount, amount), 
                    unit: '%',
                }, 
                error: insightsError
            }}
        />
    )
}