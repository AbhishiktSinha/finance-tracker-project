/* ------- userDoc SELECTORS -------- */

import getSymbolFromCurrency from "currency-symbol-map";
import { createSelector } from "reselect";

/* export const selectDefaultCurrency = ({userDoc})=> {
    if (Boolean(userDoc.data?.settings?.defaultCurrency)) {

        const { data: { settings: {defaultCurrency}} } = userDoc;
        return {
            code: defaultCurrency, 
            symbol: getSymbolFromCurrency(defaultCurrency)
        }
    }
    return undefined;
} */
export const selectDefaultCurrency = createSelector([({userDoc})=>userDoc.data?.settings?.defaultCurrency], (defaultCurrency)=>{
    return Boolean(defaultCurrency) ? {code: defaultCurrency, symbol: getSymbolFromCurrency(defaultCurrency)} : undefined;
})


/* ------------ balance SELECTORS ---------------- */

export const selectBalance = ({balance}) => balance.data;

/* ------------ newTransaction SELECTORS --------------- */
export const selectNewTransaction = ({newTransaction})=> newTransaction.data;

