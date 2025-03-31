/* ------- userDoc SELECTORS -------- */

import getSymbolFromCurrency from "currency-symbol-map";
import { createSelector } from "reselect";
import { consoleDebug } from "../../../console_styles";
// import { reduxSliceKeys } from "../defaults";

import { reduxSliceKeys } from "../defaults";


// ATTENTION: keepers of secret
export const wrapper_selectDataAsList = (sliceKey)=>{

    return createSelector(
        [(state) => state[sliceKey].data.byId],
        (data) =>
            data ? Object.entries(data).map(([id, value]) => ({ id, data: value })) : []
    );
}

export const selectDefaultCurrency = createSelector([({userDoc})=>userDoc.data?.settings?.defaultCurrency], (defaultCurrency)=>{
    return Boolean(defaultCurrency) ? {code: defaultCurrency, symbol: getSymbolFromCurrency(defaultCurrency)} : undefined;
})

/* ------------- primary transaction selecltor ------------ */
export const selectPrimaryTransactionsData = ( { [reduxSliceKeys.primaryTransactions]:state } ) => state.data.byId;
export const selectPrimaryTransactionsDataList = wrapper_selectDataAsList(reduxSliceKeys.primaryTransactions)
export const selectPrimaryTransactionsIdList = ( { [reduxSliceKeys.primaryTransactions]:state } ) => state.data.allIds;

export const wrapper_selectPrimaryTransactionData = (id)=>{
    return createSelector(
        [selectPrimaryTransactionsData], 
        (data)=>data[id]
    )
}


/* ------------ balance SELECTORS ---------------- */

export const selectBalanceData = ({[reduxSliceKeys.balance]:state}) => state.data.byId;
export const selectBalanceDataList = wrapper_selectDataAsList(reduxSliceKeys.balance);
export const selectBalanceIdList = ({[reduxSliceKeys.balance]:state})=>state.data.allIds;

/* ------------ newTransaction SELECTORS --------------- */
export const selectNewTransactionData = ({newTransaction})=> newTransaction.data;


/* -------------------- TAG SELECTORS -------------------- */

export const selectTagsData = ({[reduxSliceKeys.tags]: state}) => state.data.byId;
export const selectTagsDataList = wrapper_selectDataAsList(reduxSliceKeys.tags);
export const selectTagIdList = ({[reduxSliceKeys.tags]:state}) => state.data.allIds;

export const wrapper_selectTagsOfType = (type) => {
    
    return createSelector([selectTagsDataList], (tagsList)=>{

        return tagsList.filter( tagItem => {
                      
            // consoleDebug(`${tagItem.data.name} -- category:${tagItem.data.category} || required type: ${type}`)
            return (tagItem.data.category == type)
        })
    })
}
export const wrapper_selectTagData = (tagId) => {
    
   return createSelector(
     [selectTagsData], 
     (tagsData)=>{
        // console.log('fetch tag data for', tagId, tagsData[tagId])
        return tagsData[tagId];
     }
   )
}


export const selectUserSettings = ({userDoc})=>userDoc.data?.settings;