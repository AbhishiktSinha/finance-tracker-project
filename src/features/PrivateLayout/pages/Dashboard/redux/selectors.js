import { createSelector, createSelectorCreator } from "reselect";

import { consoleInfo } from "../../../../../console_styles";
import { DayJSUtils } from "../../../../../dayjs";
import { timeframe, transactionType } from "../../../../../enums";

import { selectNewTransaction } from "../../../redux/selectors";


/* --------------------------- dashboardTransactions SELECTORS ------------- */

export const selectTimeframe = ({dashboardTransactions: state})=> state.timeframe;

const selectStatusObject = ({dashboardTransactions: state})=> state.status;

const selectTransactionsList = ({dashboardTransactions: state})=> state.data;


/**
 * Select the status for the current timeframe
 */
export const selectTransactionsStatus = createSelector(
    selectStatusObject, 
    selectTimeframe, 
    (statusObject, timeFrame) => {
        return statusObject[timeFrame]
    })


/**
 * 
 * @param {string} type transaction type: income | expenditure, used to filter transactions
 * @returns selector function that selects the appropriate state-slice from the redux store
 */
export const wrapper_selectTransactionsInitializer = (type)=>{

    return createSelector( selectTimeframe, selectTransactionsList,
        (currentTimeframe, transactionsList)=> {

            // filter the transactions according to given type
            const transactionsOfType = transactionsList.filter( ({data}) => data.type == type );

            // if timeframe is the month, we don't need futher filter
            if ( currentTimeframe == timeframe.MONTH) { return transactionsOfType }
            else if( currentTimeframe == timeframe.WEEK) {

                // filter the transactions that lie within the current week
                const dayJsUtils = new DayJSUtils();
            
                return transactionsOfType.filter( ({data})=> {
                    
                    return dayJsUtils.isWithinTimeframe(timeframe.WEEK, data.timeFrame.occurredAt)
                })

            }
        }
    )
}

/* ------------------------------ newTransaction SELECTORS ------------ */

export const selectNewTransaction_balance = createSelector( selectNewTransaction, 
    (newTransaction)=>newTransaction
)
export const selectNewTransaction_income = createSelector( selectNewTransaction, selectTimeframe,
    (newTransaction, timeframe)=>{

        const { data: {type, timestamp: {occurredAt}}} = newTransaction;

        if (type == transactionType.INCOME &&
            new DayJSUtils().isWithinTimeframe(timeframe, occurredAt)) {
            return newTransaction;
        }
        else {
            return undefined;
        }
    }
)
export const selectNewTransaction_expenditure = createSelector( selectNewTransaction, selectTimeframe,
    (newTransaction, timeframe)=>{

        const { data: {type, timestamp: {occurredAt}}} = newTransaction;

        if (type == transactionType.EXPENDITURE &&
            new DayJSUtils().isWithinTimeframe(timeframe, occurredAt)) {
            return newTransaction;
        }
        else {
            return undefined;
        }
    }
)