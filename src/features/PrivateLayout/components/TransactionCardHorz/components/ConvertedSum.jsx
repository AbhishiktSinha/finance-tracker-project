import { useSelector } from "react-redux";
import { selectDefaultCurrency } from "../../../redux/selectors";
import ExchangeRateConvertor from "../../../../../exchangeRate_api/convertor";
import { transactionType } from "../../../../../enums";

export default function ConvertedSum({type, amount, currency_code}) {

    const defaultCurrency = useSelector(selectDefaultCurrency);
    const amount_conv = new ExchangeRateConvertor()
        .convertAmount(
            defaultCurrency.code,
            { currency: currency_code, amount: amount }
        )

    if (defaultCurrency.code == currency_code) {
        return <></>
    }
    
    return (
        <div className="converted-sum">
            <span className="separator"> ⟺</span>
            <span className="transaction-card-sum transaction-sum-default-currency">
                {type == transactionType.INCOME ? '+': '-'}{defaultCurrency.symbol}{Math.ceil(amount_conv)}
            </span>
        </div>
    )
}