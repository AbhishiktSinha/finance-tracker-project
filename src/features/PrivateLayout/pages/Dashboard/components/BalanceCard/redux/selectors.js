import getSymbolFromCurrency from "currency-symbol-map";
import { createSelector } from "reselect";

// INPUT SELECTORS
const selectDefaultCurrency = ({userDoc} ) => userDoc.data?.settings?.defaultCurrency

const selectBalance = ({userDoc}) => userDoc.data?.balance

const selectTransactions = ({userDoc}) => userDoc.data?.transactions

// OUTPUT SELECTORS
const selectBalanceCardData = createSelector(
    selectDefaultCurrency, selectBalance, selectTransactions,
    (defaultCurrency, balance, transactions)=>{

        return {
            'defaultCurrency': Boolean(defaultCurrency) ? {
                symbol: getSymbolFromCurrency(defaultCurrency),
                code: defaultCurrency
             } : 'pending',

            'balance': Boolean(balance) ? balance : 'pending',
            
            'transactions': transactions,
        };
    }
)

export {selectBalanceCardData}