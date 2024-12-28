/* ------- userDoc SELECTORS -------- */

import getSymbolFromCurrency from "currency-symbol-map";
import { createSelector } from "reselect";
import { consoleDebug } from "../../../console_styles";

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

export const selectBalanceData = ({balance}) => balance.data;

/* ------------ newTransaction SELECTORS --------------- */
export const selectNewTransactionData = ({newTransaction})=> newTransaction.data;

/* -------------------- TAG SELECTORS -------------------- */
export const selectTags = ({tags}) => tags.data;
export const wrapper_selectTagsOfType = (type) => {
    
    return createSelector([selectTags], (tagsList)=>{

        return tagsList.filter( tagItem => {
                      
            // consoleDebug(`${tagItem.data.name} -- category:${tagItem.data.category} || required type: ${type}`)
            return (tagItem.data.category == type)
        })
    })
}
export const selectTag_wrapper = (tagId) => {
    
    return createSelector(selectTags, 
        (tagsList=>{
            return tagsList.filter(
                ({id, data})=>{
                    
                    return id==tagId
                }
            )[0];
        })
    )
}