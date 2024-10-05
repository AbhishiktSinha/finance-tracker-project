import { useSelector } from "react-redux";
import { selectNewTransaction_income, selectTimeframe, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { transactionType } from "../../../../../../enums";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { useDynamicAmount } from "../../../../../../custom_hooks";
import { checkDisplayUI } from "../../../../utils";
import DashboardTransactionCard from "../DashboardTransactionCard";


export default function IncomeCard() {

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.INCOME)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransaction = useSelector(selectNewTransaction_income);

    const timeframe = useSelector(selectTimeframe);

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransaction, 
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
                timeframe: timeframe
            }}
        />
    )
}