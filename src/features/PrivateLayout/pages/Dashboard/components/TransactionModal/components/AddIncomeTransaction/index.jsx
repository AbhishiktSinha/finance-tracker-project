import { transactionType } from "../../../../../../../../enums";
import AddTransactionForm from "../AddTransactionForm";

export default function AddIncomeTransaction() {
    return (
        <AddTransactionForm 
            transactionType={transactionType.INCOME}
        />
    )
}