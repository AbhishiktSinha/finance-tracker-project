import { useSelector } from "react-redux";

import './styles.css'
import { selectOptionalTransactions } from "./redux/selectors";

export default function TransactionCardsWrapper() {

    const {transactions} = useSelector(selectOptionalTransactions);
    console.log('transactions:', transactions);

    return (
        <div className="transcations-card-wrapper">
            {
                transactions==null && (
                    <div className="transactions-not-found">
                        <div className="faux-error-code">404</div>
                        <p>No Transactions Found</p>
                    </div>
                )
            }

        </div>
    )
}