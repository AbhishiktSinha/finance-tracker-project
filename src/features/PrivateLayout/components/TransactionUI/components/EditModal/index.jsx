import { useContext, useMemo } from "react";
import TransactionMangementForm from "../../../../../../components_common/TransactionManangementForm";
import { useDispatch, useSelector } from "react-redux";
import { modifyTransactionThunk } from "../../../../redux/thunk";
import userAuthContext from "../../../../context/userAuthContext";
import { transactionType } from "../../../../../../enums";
import { selectBalanceData } from "../../../../redux/selectors";

export default function EditModal({id, data, onEdit}) {

    const {user: {uid}} = useContext(userAuthContext)

    const defaults = useMemo(()=>{
        const defaults = {};

        defaults.id = id;
        defaults.occurredAt = data.timestamp.occurredAt;

        for (let field in data) {
            if (typeof field != "object") {
                defaults[field] = data[field];
            }
        }
        return defaults;
    }, [])

    const balanceData = useSelector(selectBalanceData);
    const dispatch = useDispatch();

    /* --- function to check if the modified transaction if expenditure, is possible ---- */
    function onFinishCheck(formFields) {

        if (formFields.type == transactionType.EXPENDITURE) {

            const selectedCurrencyBalanceAmount = balanceData[formFields.currency]
    
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
            transactionType={data.type}
            onFinishCheck={onFinishCheck}
            onFinishAction={onFinishAction}
        />
    )    
}