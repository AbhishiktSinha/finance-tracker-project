import { transactionType } from "../../../../../../../../enums";
import TransactionMangementForm from "../../../../../../../../components_common/TransactionManangementForm";

export default function AddIncomeTransaction({onFinshDispatch}) {
        
    return (
        <TransactionMangementForm 
            transactionType={transactionType.INCOME}
            onFinishDispatch={onFinshDispatch}
        />
    )
}