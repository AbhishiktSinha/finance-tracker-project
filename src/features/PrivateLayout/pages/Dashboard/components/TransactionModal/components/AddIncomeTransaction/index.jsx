import { transactionType } from "../../../../../../../../enums";
import TransactionMangementForm from "../../../../../../../../components_common/TransactionManangementForm";

export default function AddIncomeTransaction({onFinishAction}) {
        
    return (
        <TransactionMangementForm 
            transactionType={transactionType.INCOME}
            onFinishAction={onFinishAction}
        />
    )
}