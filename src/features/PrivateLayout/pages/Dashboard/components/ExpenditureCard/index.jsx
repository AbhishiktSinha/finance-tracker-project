import { useSelector } from "react-redux";
import { selectNewTransaction_expenditure, selectTimeframe, wrapper_selectTransactionsInitializer } from "../../redux/selectors";
import { transactionType } from "../../../../../../enums";
import { selectDefaultCurrency } from "../../../../redux/selectors";
import { useDynamicAmount } from "../../../../../../custom_hooks";
import { checkDisplayUI } from "../../../../utils";
import DashboardTransactionCard from "../DashboardTransactionCard";


export default function ExpenditureCard() {

    const initializer = useSelector(
        wrapper_selectTransactionsInitializer(transactionType.EXPENDITURE)
    )
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransaction = useSelector(selectNewTransaction_expenditure);

    const timeframe = useSelector(selectTimeframe);

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransaction, 
        transactionType.EXPENDITURE);

    const showCardUI = checkDisplayUI([status]);

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
        />
    )
}