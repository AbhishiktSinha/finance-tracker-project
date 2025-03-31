import getSymbolFromCurrency from "currency-symbol-map";
import { transactionType } from "../../../../../../enums";
import { selectDefaultCurrency } from "../../../../redux/selectors";

export default function TransactionAmount({type, amount, currency}) {

    const {code, symbol} = useSelector(selectDefaultCurrency);    
    
    const amount_conv = new ExchangeRateConvertor()
        .convertAmount( defaultCurrency.code,
            { currency, amount } )

    if (defaultCurrency.code == currency_code) {
        return (
            <span className={"transaction-amount" + " " + type}>
                {type == transactionType.INCOME ? "+" : "-"}
                {getSymbolFromCurrency(currency)}
                {amount}
            </span>
        )
    }
    
    return (
        <>
            <span className={"transaction-amount" + " " + type}>
                {type == transactionType.INCOME ? "+" : "-"}
                {getSymbolFromCurrency(currency)}
                {amount}
            </span>

            <span className="separator"> ⟺</span>

            <span className="transaction-amount-default-currency">
                {type == transactionType.INCOME ? '+': '-'}
                {symbol}
                {Math.ceil(amount_conv)}
            </span>
        </>
    )
}