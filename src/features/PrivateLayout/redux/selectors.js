/* ------- userDoc SELECTORS -------- */

import getSymbolFromCurrency from "currency-symbol-map";

export const selectDefaultCurrency = ({userDoc})=> {
    if (Boolean(userDoc.data?.settings?.defaultCurrency)) {

        const { data: { settings: {defaultCurrency}} } = userDoc;
        return {
            code: defaultCurrency, 
            symbol: getSymbolFromCurrency(defaultCurrency)
        }
    }
    return undefined;
}


/* ------------ balance SELECTORS ---------------- */

export const selectBalance = ({balance}) => balance.data;

/* ------------ newTransaction SELECTORS --------------- */
export const selectNewTransaction = ({newTransaction})=> newTransaction.data;

