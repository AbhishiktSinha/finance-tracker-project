
import { createSelector } from "reselect";

import { consoleInfo } from "../../../../../console_styles";
import { DayJSUtils } from "../../../../../dayjs";
import { timeframe, transactionType } from "../../../../../enums";

import { selectNewTransaction } from "../../../redux/selectors";



/* --------------------------- dashboardTransactions SELECTORS ------------- */
export const selectActiveTimeframe = ({dashboardTransactions})=>dashboardTransactions.timeframe;

export const selectDashboardTransactionStatus = ({dashboardTransactions: state})=> state.status;

const selectTransactionsList = ({dashboardTransactions: state})=> state.data;


/**
 * 
 * @param {string} type transaction type: income | expenditure, used to filter transactions
 * @returns selector function that selects the appropriate state-slice from the redux store
 */
export const wrapper_selectTransactionsInitializer = (type)=>{

    return createSelector( selectActiveTimeframe, selectTransactionsList,
        (currentTimeframe, transactionsList)=> {

            // filter the transactions according to given type
            const transactionsOfType = transactionsList.filter( ({data}) => data.type == type );

            // if timeframe is the YEAR, we don't need futher filter
            if ( currentTimeframe == timeframe.YEAR ) {
                return transactionsOfType;
            }
            else {                                
                
                return filterByTimeframe(currentTimeframe);

                function filterByTimeframe(targetTimeframe){

                    return transactionsOfType.
                        filter(({ data: transactionData }) => {

                            const { timestamp: { occurredAt } } = transactionData;

                            return DayJSUtils.isWithinTimeframe(
                                targetTimeframe,
                                occurredAt
                            )
                        })
                }              
                
            }            
        }
    )
}

/* ------------------------------ newTransaction SELECTORS ------------ */

export const selectNewTransaction_balance = createSelector( selectNewTransaction, 
    (newTransaction)=>newTransaction?newTransaction:undefined
)
export const selectNewTransaction_income = createSelector( selectNewTransaction, selectActiveTimeframe,
    (newTransaction, timeframe)=>{

        if (newTransaction) {
            
            const { data: {type, timestamp: {occurredAt}}} = newTransaction;
    
            if (type == transactionType.INCOME &&
                DayJSUtils.isWithinTimeframe(timeframe, occurredAt)) {
                return newTransaction;
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
export const selectNewTransaction_expenditure = createSelector( selectNewTransaction, selectActiveTimeframe,
    (newTransaction, timeframe)=>{

        if (newTransaction) {
            
            const { data: {type, timestamp: {occurredAt}}} = newTransaction;
    
            if (type == transactionType.EXPENDITURE &&
                DayJSUtils.isWithinTimeframe(timeframe, occurredAt)) {
                return newTransaction;
            }
            else {
                return undefined;
            }
        }

    }
)
