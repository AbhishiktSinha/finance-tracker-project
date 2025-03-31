
import { createSelector } from "reselect";

import { consoleError, consoleInfo } from "../../../../../console_styles";
import { DayJSUtils } from "../../../../../dayjs";
import { transactionType } from "../../../../../enums";

import { selectBalanceData, selectNewTransactionData, selectPrimaryTransactionsData, selectPrimaryTransactionsDataList, selectPrimaryTransactionsIdList, wrapper_selectDataAsList } from "../../../redux/selectors";


/* --------------------------- dashboardTransactions SELECTORS ------------- */
export const selectActiveTimeframe = ({dashboardTransactions})=>dashboardTransactions.timeframe;

export const selectDashboardTransactionStatus = ({dashboardTransactions: state})=> state.status;





/* ------------------------------ newTransaction SELECTORS ------------ */
// #region DEPRECATED

/**## selectNewTransactionData_wrapper
 * Wrapper function that returns a selector that is transaction type, and activeTimeframe aware.
 * 
 * @param {string} type type of transaction as defined in `transactionType` enum
 * @returns selector function
 */
export const selectNewTransactionData_wrapper = (type, activeTimeframe)=>{

    return createSelector( selectNewTransactionData, 
        (newTransactionData)=>{

            
            // ------- initial case ----
            if (!newTransactionData) {
                consoleError('newTransaction ----------------- Initial Case')
                return undefined;
            }
            
            const {timestamp: {occurredAt}} = newTransactionData;

            if (type == transactionType.ALL) {
                consoleInfo('newTransaction ------------ Balance Case -> select ALL');
                return newTransactionData
            }
            else if (type == newTransactionData.type && 
                DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt, 0)) {

                return newTransactionData;
            }
            else {
                return undefined;
            }
        }
    )
}

// #endregion


/* ---------------------- RECENT TRANSACTIONS SELECTORS ------------------ */

export const selectRecentTransactionsList_wrapper = (activeTimeframe)=>{

    return createSelector( selectPrimaryTransactionsDataList, 
        (primaryTransactionsData)=>{
            
            return primaryTransactionsData
                .filter(
                    ({ id: transactionId, data: transactionData }) => {

                        const { timestamp: { occurredAt } } = transactionData;

                        return DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt)
                    }
                )
                .sort(
                    ({data: transaction_1_data}, {data: transaction_2_data}) => {

                        return (transaction_2_data.timestamp.occurredAt - transaction_1_data.timestamp.occurredAt)                       
                    }
                )
                .slice(0, defaults.maxRecentTransactions);
        }
    )
}

export const wrapper_selectRecentTransactionsIdList = (activeTimeframe, length)=>{

    return createSelector(
        [selectPrimaryTransactionsIdList, selectPrimaryTransactionsData], 
        (allIds, byId)=>{

            return allIds
                .filter( id => {
                        
                        const {timestamp: {occurredAt}} = byId[id];
                        return DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt)
                    }                    
                )
                .sort(
                    (id_1, id_2) => {
                        
                        const {timestamp: {occurredAt: transaction_1_occurredAt}} = byId[id_1]
                        const {timestamp: {occurredAt: transaction_2_occurredAt}} = byId[id_2];

                        return transaction_2_occurredAt - transaction_1_occurredAt
                    }
                )
                .slice(0, length)
        }
    )
}


/* ------------------------ ACCUMULATOR SELECTORS ----------- */
export const selectBalanceInitializer = createSelector(
    [selectBalanceData], 
    (balanceData)=>Object.values(balanceData)
)

/**### Note: 
 * This selector returns a filtered array, which is always a new reference.
 * So this selected value will always be different between re-renders. 
 * 
 * Further optimisation is needed to avert re-painting UI
 * 
 * @param {string} type INCOME | EXPENDITURE
 * @param {string} activeTimeframe timeframeEnum: MONTH | WEEK | YEAR
 * @returns selector function to retrieve the transactions initializer
*/
export const wrapper_selectTransactionsInitializer = (type, activeTimeframe)=>{

    return createSelector(
        [selectPrimaryTransactionsData],
        (transactionsData) => {

            return Object.values(transactionsData).
                filter(({ type: transactionType, timestamp: { occurredAt } }) => {
                    return transactionType == type && DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt)
                })
        }
    )
}