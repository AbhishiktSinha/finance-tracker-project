import { timeframe } from "../../../../../enums";
import { FETCH, UDPATE } from "./actions";

const { 
    FETCH_DASHBOARD_TRANSACTIONS_REQUEST : FETCH_REQUEST,
    FETCH_DASHBOARD_TRANSACTIONS_SUCCESS : FETCH_SUCCESS,
    FETCH_DASHBOARD_TRANSACTIONS_ERROR : FETCH_ERROR
 } = FETCH;

const {
    ADD_DASHBOARD_TRANSACTION,
    TOGGLE_TIMEFRAME,    
} = UDPATE


const initialState = {
    timeframe: 'week', // week | month

    status: {
        // initial | loading | success | error
        [timeframe.WEEK] : 'iniitial',
        [timeframe.MONTH] : 'initial',
    }, 
    data: undefined,
    error: '',
}

export default function dashboardTransactionsReducer(state = initialState, action) {

    const {type, payload} = action;

    switch(type) {
        
        case FETCH_REQUEST : {
            /*The status of the selected timeframe
            becomes 'loading'
            */    
            return {
                ...state,
                status: {
                    ...state.status,
                    [state.timeframe] : 'loading'
                }
            }
        }
        case FETCH_SUCCESS: {
            
            return {
                ...state,

                status: {
                    ...state.status, 
                    [state.timeframe] : 'success',
                },

                data: payload, 

                error: ''
            }
        }
        case FETCH_ERROR: {

            return {
                ...state, 

                status: {
                    ...state.status, 
                    [state.timeframe]: 'error',
                },

                error: payload,
            }
        }

        case ADD_DASHBOARD_TRANSACTION :{
            return {
                ...state, 
                data: [
                    ...state.data, 
                    payload
                ]
            }
        }
        case TOGGLE_TIMEFRAME :{
            const getNewTimeframe = ()=>{
                if (state.timeframe == 'weekly') {
                    return 'monthly'
                }
                else if (state.timeframe == 'monthly') {
                    return 'weekly'
                }
            }

            return {
                ...state, 
                timeframe: getNewTimeframe(),
            }
        }
    }
}