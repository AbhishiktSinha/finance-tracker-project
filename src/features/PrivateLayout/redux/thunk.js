import { FETCH } from './actions'
import { updateUserData } from './actionCreators';
import { FirestoreCRUD } from '../../../firebase/firestore';
import { consoleDebug, consoleError, consoleInfo } from '../../../console_styles';
import { selectDefaultCurrency } from '../pages/Dashboard/redux/selectors';
import { updateExchangeRate } from '../pages/Dashboard/utils';

export const fetchUserDocThunk = (uid) => {

    consoleDebug('thunk wrapper')
    // return thunk that performs the asynchronous task
    return async (dispatch, getState) => {
        consoleDebug('USERDOC THUNK')
        const { FETCH_DATA_ERROR, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS } = FETCH;

        // signify: network call started
        dispatch({ type: FETCH_DATA_REQUEST });

        // fetch user doc details from firestore
        try {
            const userDoc = await new FirestoreCRUD().getDocData(`users/${uid}`);

            // ON SUCCESS
            dispatch({
                type: FETCH_DATA_SUCCESS,
                payload: {data: userDoc}
            })
        }
        catch (e) {
            consoleError(e.message);
            dispatch({
                type: FETCH_DATA_ERROR,
                payload: e.message,
            })
        }
    }
}

/** THUNK to update the userDoc with the balace data.
 * 
 * On successful firestore update, reflect the changes in the redux store
 */
export const updateOnboardingDataThunk = function (uid, data) {

    return async (dispatch) => {

        const { defaultCurrency, balance } = data;
        console.log('updateOnboardinDataThunk data recieved:', defaultCurrency, balance)
        try {
            await new FirestoreCRUD().updateDocData(
                `users/${uid}`,
                {
                    'settings.defaultCurrency': defaultCurrency,
                    balance: {
                        [defaultCurrency]: Number(balance)
                    }
                }
            )

            dispatch(
                updateUserData({
                    balance: {
                        [defaultCurrency]: Number(balance)
                    },
                    settings: {
                        defaultCurrency: defaultCurrency
                    }
                })
            )
        }
        catch (e) {
            throw e;
        }
    }

}

/**THUNK to handle conditional updates to the exchangeRate data stored in localStorage
 * This thunk middleware function does note deal with application state updates
 * 
 * This operation is handled in a thunk of the dashboard for the following reasons: 
 *  1. Avoid direct dependency of the dashboard component on the defaultCurrency
 *  2. Selectors can be used without any controversy in thunks 
 */
export const updateExchangeRateThunk = ()=>{

    consoleInfo('updateExchangeRate T H U N K WRAPPER')

    return async (dispatch, getState)=> {

        consoleInfo('thunk to update exchange rate in localStorage')
        consoleDebug(`exhangeRate exists: ${Boolean(localStorage.getItem('exchangeRate'))}`)

        
        // check if data exists already
        if (Boolean(localStorage.getItem('exchangeRate'))) {
            
            const exchangeRate = JSON.parse(localStorage.getItem('exchangeRate'));
            
            // abort if 1 day has not passed
            const margin = 500; //milliseconds
            
            const time_next_update = exchangeRate['time_next_update'];
            const time_now = new Date().getTime();

            consoleInfo('exchangeRate object found');
            consoleDebug(`time_next_update: ${time_next_update} || time_now: ${time_now}`)
            
            if (time_now < time_next_update) { 
                consoleError(`ExchangeRate API call aborted: Call on same day`);
                return; 
            }
        }

        try {
            const state = getState();
            consoleDebug('getState from updateExchangeRateThunk called from Dashboard')
            console.log(state);
            updateExchangeRate(selectDefaultCurrency(state))
        }
        catch(e) {
            console.log(e);
        }
    
    }
}