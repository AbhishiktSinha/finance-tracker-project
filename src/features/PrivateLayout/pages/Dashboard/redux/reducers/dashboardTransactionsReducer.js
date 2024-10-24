import { asyncStatus, timeframe } from "../../../../../../enums";
import { FETCH_DASHBOARD_TRANSACTIONS as FETCH, UDPATE_DASHBOARD_TRANSACTIONS as UDPATE } from "../actions/dashboardTransactionsActions";

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

    timeframe: timeframe.MONTH, //default UI timeframe

    status: asyncStatus.INITIAL, 
    data: undefined,
    error: '',
}

export default function dashboardTransactionsReducer(state = initialState, action) {

    const {type, payload} = action;

    switch(type) {
        
        case FETCH_REQUEST : {
            /*The status of the selected timeframe
            becomes asyncStatus.INITIAL
            */    
            return {
                ...state,
                status: asyncStatus.LOADING,
            }
        }
        case FETCH_SUCCESS: {
            
            return {
                ...state,

                status: asyncStatus.SUCCESS,

                data: payload, 

                error: ''
            }
        }
        case FETCH_ERROR: {

            return {
                ...state, 

                status: asyncStatus.ERROR,

                error: payload,
            }
        }

        case ADD_DASHBOARD_TRANSACTION :{
            // add the transaction object recieved as the payload to the data (list)
            return {
                ...state, 
                data: [
                    ...state.data, 
                    payload
                ]
            }
        }
        case TOGGLE_TIMEFRAME :{

            return {
                ...state, 
                timeframe: payload, 
            }
        }
        default: {
            return state;
        }
    }
}