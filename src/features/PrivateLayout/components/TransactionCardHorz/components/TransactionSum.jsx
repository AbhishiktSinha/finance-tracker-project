import getSymbolFromCurrency from "currency-symbol-map";
import { transactionType } from "../../../../../enums";

export default function TransactionSum({ type, amount, currency_code }) {

    const currency_symbol = getSymbolFromCurrency(currency_code);

    return (
        <span className={
            `transaction-card-sum 
            transaction-sum-original-currency
            ${type}-transaction-sum
            `}>
            {type == transactionType.INCOME ? "+" : "-"}{currency_symbol}{amount}
        </span>
    )
}