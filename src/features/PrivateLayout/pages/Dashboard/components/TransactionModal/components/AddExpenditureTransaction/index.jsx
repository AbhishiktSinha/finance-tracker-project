import { useSelector } from "react-redux";
import TransactionMangementForm from "../../../../../../../../components_common/TransactionManangementForm";
import { selectBalanceData } from "../../../../../../redux/selectors";
import { transactionType } from "../../../../../../../../enums";
import { consoleDebug } from "../../../../../../../../console_styles";

export default function AddExpenditureTransaction({onFinishAction}) {

    const balanceData = useSelector(selectBalanceData);

    consoleDebug('EXPENDITURE FORM BALANCE DATA');
    console.log(balanceData)

    const onFinishCheck = (formValues)=> {

        const transactionAmt = Number(formValues.amount);

        const selectedCurrencyBalanceObj = balanceData[formValues.currency]

        const availableAmt = selectedCurrencyBalanceObj.amount;

        consoleDebug('Selected Expense Balance:');
        console.log(selectedCurrencyBalanceObj);

        console.log('Expenditure AMount:',transactionAmt)
        
        if (availableAmt < transactionAmt) {
            throw 'Insufficient balance in selected currency';
        }
    }

    return (
        <TransactionMangementForm 
            transactionType={transactionType.EXPENDITURE}
            onFinishAction={onFinishAction}
            onFinishCheck={onFinishCheck}
        />
    )
}