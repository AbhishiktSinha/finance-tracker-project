
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

export const selectNewTransactionData_balance = createSelector( selectNewTransaction, 
    (newTransactionData)=>newTransactionData?newTransactionData:undefined
)
export const selectNewTransactionData_income = createSelector( selectNewTransaction, selectActiveTimeframe,
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
export const selectNewTransactionData_expenditure = createSelector( selectNewTransaction, selectActiveTimeframe,
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
