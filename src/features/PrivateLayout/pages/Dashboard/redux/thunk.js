import { consoleError, consoleInfo, consoleSucess } from '../../../../../console_styles';
import { DayJSUtils } from '../../../../../dayjs';
import { timeframe } from '../../../../../enums';
import { FirestoreCRUD } from '../../../../../firebase/firestore';
import {FETCH_DASHBOARD_TRANSACTIONS as FETCH} from './actions'

/** THUNK  
 * function that loads the transactions for timeframe MONTH
 * to populate the dashboardInitialState
 * 
 * this data is not fetched or stored in redux state in any order
 * whatever sorting needs to be implemented must be done in the UI state and not the application state
 * keep application state processing lights
 * 
 * call this thunk post the first render of the <Dashboard/>
 */
export function fetchDashboardTransactionsThunk(uid) {
    
    const {
        FETCH_DASHBOARD_TRANSACTIONS_REQUEST, 
        FETCH_DASHBOARD_TRANSACTIONS_SUCCESS,
        FETCH_DASHBOARD_TRANSACTIONS_ERROR
    } = FETCH;

    return async (dispatch, getState)=>{
        // TODO: write the function body

        dispatch({
            type: FETCH_DASHBOARD_TRANSACTIONS_REQUEST
        })

        // GET THE TRANSACTIONS FOR THE CURRENT YEAR
        /* Transaction toggle is a UI modification, it should not trigger an API call */
        const fetchForTimeframe = timeframe.YEAR;

        const dayJsUtils = new DayJSUtils();

        try {
            
            const transactionsList = await new FirestoreCRUD().
                getDocsData(
                    `users/${uid}/transactions`,
                    [
                        {
                            key: 'timestamp.occurredAt',
                            relationship: '>=',
                            value: dayJsUtils.getFirstDayTimestamp(fetchForTimeframe)
                        },
                        {
                            key: 'timestamp.occurredAt',
                            relationship: '<=',
                            value: dayJsUtils.getLastDayTimestamp(fetchForTimeframe)
                        }
                    ],                    
                )   

            consoleSucess('DASHBOARD TRANSACTIONS FETCHED');

            dispatch({
                type: FETCH_DASHBOARD_TRANSACTIONS_SUCCESS,
                payload: transactionsList
            })
        }
        catch(e) {
            consoleError(e);
            dispatch({
                type: FETCH_DASHBOARD_TRANSACTIONS_ERROR,
                payload: e
            })
        }
    }
}