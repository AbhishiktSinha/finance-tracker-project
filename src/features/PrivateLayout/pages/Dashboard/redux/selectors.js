
import { createSelector, createSelectorCreator } from "reselect";

import { consoleError, consoleInfo } from "../../../../../console_styles";
import { DayJSUtils } from "../../../../../dayjs";
import { timeframe, transactionType } from "../../../../../enums";

import { selectNewTransactionData, selectPrimaryTransactionsList } from "../../../redux/selectors";
import defaults from "../defaults";



/* --------------------------- dashboardTransactions SELECTORS ------------- */
export const selectActiveTimeframe = ({dashboardTransactions})=>dashboardTransactions.timeframe;

export const selectDashboardTransactionStatus = ({dashboardTransactions: state})=> state.status;



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
export const selectTransactionsInitializer_wrapper = (type, activeTimeframe)=> {

    return createSelector(selectPrimaryTransactionsList, (primaryTransactionsData)=> {

        // filter by type
        // filter by timestamp.occurredAt within the current activeTimeframe -> within current MONTH/WEEK/YEAR
        return primaryTransactionsData.filter(
            ({id: transactionId, data: transactionData})=>{

                const {type: transactionType, timestamp : {occurredAt}} = transactionData;

                return ( transactionType == type && DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt) )
        })
    })
}

/* ------------------------------ newTransaction SELECTORS ------------ */


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

export const selectRecentTransactionsList_wrapper = (activeTimeframe)=>{

    return createSelector( selectPrimaryTransactionsList, 
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

                        if (transaction_1_data.timestamp.occurredAt > transaction_2_data.timestamp.occurredAt) {
                            return 1;
                        }
                        else if (transaction_2_data.timestamp.occurredAt < transaction_1_data.timestamp.occurredAt) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                )
                .slice(0, defaults.maxRecentTransactions);
        }
    )
}

/* export const selectNewTransactionData_income = createSelector( selectNewTransactionData, selectActiveTimeframe,
    (newTransactionData, activeTimeframe)=>{

        if (newTransactionData) {
            
            const { type, timestamp: {occurredAt} } = newTransactionData;
    
            if (type == transactionType.INCOME &&
                DayJSUtils.isWithinTimeframe(activeTimeframe, occurredAt, 0)) {
                return newTransactionData;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }

    }
)
export const selectNewTransactionData_expenditure = createSelector( selectNewTransactionData, selectActiveTimeframe,
    (newTransactionData, timeframe)=>{

        if (newTransactionData) {
            
            const { type, timestamp: {occurredAt} } = newTransactionData;
    
            if (type == transactionType.EXPENDITURE &&
                DayJSUtils.isWithinTimeframe(timeframe, occurredAt)) {
                return newTransactionData;
            }
            else {
                return undefined;
            }
        }

    }
)
 */