import { useSelector } from "react-redux";
import AddTransactionForm from "../AddTransactionForm";
import { selectBalance } from "../../../../../../redux/selectors";
import { transactionType } from "../../../../../../../../enums";
import { consoleDebug } from "../../../../../../../../console_styles";

export default function AddExpenditureTransaction({onFinishDispatch}) {

    const balanceData = useSelector(selectBalance);

    consoleDebug('EXPENDITURE FORM BALANCE DATA');
    console.log(balanceData)

    const onFinishCheck = (formValues)=> {

        const transactionAmt = Number(formValues.amount);

        const selectedCurrencyBalanceObj = balanceData.find( 
            (balanceObject)=>balanceObject.data.currency == formValues.currency);

        const availableAmt = selectedCurrencyBalanceObj.data.amount;

        consoleDebug('Selected Expense Balance:');
        console.log(selectedCurrencyBalanceObj);

        console.log('Expenditure AMount:',transactionAmt)
        
        if (availableAmt < transactionAmt) {
            throw 'Insufficient balance in selected currency';
        }
    }

    return (
        <AddTransactionForm 
            transactionType={transactionType.EXPENDITURE}
            onFinishDispatch={onFinishDispatch}
            onFinishCheck={onFinishCheck}
        />
    )
}