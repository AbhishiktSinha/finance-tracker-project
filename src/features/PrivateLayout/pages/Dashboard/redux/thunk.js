import { consoleError, consoleInfo } from '../../../../../console_styles';
import { DayJSUtils } from '../../../../../dayjs';
import { FirestoreCRUD } from '../../../../../firebase/firestore';
import {FETCH} from './actions'
import { selectTimeframe } from './selectors';

/** THUNK  
 * function that loads the transactions within default timeframe
 * to populate the dashboardInitialState
 * 
 * this data is not fetched or stored in redux state in any order
 * whatever sorting needs to be implemented must be done in the UI state and not the application state
 * keep application state processing lights
 * 
 * call this thunk when status of selected timeframe is initial
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

        const timeframe = selectTimeframe(getState()); 

        const dayJsUtils = new DayJSUtils();

        try {
            
            const transactionsList = await new FirestoreCRUD().
                getDocsData(
                    `users/${uid}/transactions`,
                    [
                        {
                            key: 'timestamp.occurredAt',
                            relationship: '>=',
                            value: dayJsUtils.getFirstDayTimestamp(timeframe)
                        },
                        {
                            key: 'timestamp.occurredAt',
                            relationship: '<=',
                            value: dayJsUtils.getLastDayTimestamp(timeframe)
                        }
                    ],                    
                )
            
            /* TODO:
             complete function definition
             check whether firestore queries check based on number or string    
             */

            consoleInfo('DASHBOARD TRANSACTIONS FETCHED');

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