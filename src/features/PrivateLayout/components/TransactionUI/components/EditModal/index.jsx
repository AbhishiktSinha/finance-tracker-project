import { useContext, useMemo } from "react";
import TransactionMangementForm from "../../../../../../components_common/TransactionManangementForm";
import { useDispatch, useSelector } from "react-redux";
import { modifyTransactionThunk } from "../../../../redux/thunk";
import userAuthContext from "../../../../context/userAuthContext";
import { transactionType } from "../../../../../../enums";
import { selectBalanceData } from "../../../../redux/selectors";

export default function EditModal({transactionObject, onEdit}) {

    const {user: {uid}} = useContext(userAuthContext)

    const defaults = useMemo(()=>{
        const defaults = {};

        defaults.id = transactionObject.id;
        defaults.occurredAt = transactionObject.data.timestamp.occurredAt;

        for (let field in transactionObject.data) {
            if (typeof field != "object") {
                defaults[field] = transactionObject.data[field];
            }
        }
        return defaults;
    }, [])

    const balanceData = useSelector(selectBalanceData);
    const dispatch = useDispatch();

    /* --- function to check if the modified transaction if expenditure, is possible ---- */
    function onFinishCheck(formFields) {

        if (formFields.type == transactionType.EXPENDITURE) {

            const selectedCurrencyBalanceAmount = balanceData.find(
                ({id, data: {currency, amount}})=> currency == formFields.currency
            ).data.amount;
    
            if (selectedCurrencyBalanceAmount < formFields.amount) {
                throw 'Insufficient balance in selected currency';
            }
        }
        
    }

    function onFinishAction(formFields, modifiedFields) {
        
        return dispatch(modifyTransactionThunk(uid, formFields, modifiedFields, onEdit))
    }

    return (
        <TransactionMangementForm 
            defaults={defaults}
            modification={true}
            transactionType={transactionObject.data.type}
            onFinishCheck={onFinishCheck}
            onFinishAction={onFinishAction}
        />
    )    
}