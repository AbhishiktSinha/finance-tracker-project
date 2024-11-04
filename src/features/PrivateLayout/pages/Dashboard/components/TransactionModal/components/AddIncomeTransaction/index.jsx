import { transactionType } from "../../../../../../../../enums";
import AddTransactionForm from "../AddTransactionForm";

export default function AddIncomeTransaction({onFinshDispatch}) {
        
    return (
        <AddTransactionForm 
            transactionType={transactionType.INCOME}
            onFinishDispatch={onFinshDispatch}
        />
    )
}