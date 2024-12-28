import { asyncStatus } from "../../../../enums";
import { FETCH_PRIMARY_TRANSACTIONS, UDPATE_PRIMARY_TRANSACTIONS } from "../actions/primaryTransactionsActions";

const {
    FETCH_PRIMARY_TRANSACTIONS_REQUEST: FETCH_REQUEST, 
    FETCH_PRIMARY_TRANSACTIONS_SUCCESS: FETCH_SUCCESS, 
    FETCH_PRIMARY_TRANSACTIONS_ERROR: FETCH_ERROR,
} = FETCH_PRIMARY_TRANSACTIONS;

const {
    ADD_PRIMARY_TRANSACTION: ADD_TRANSACTION, 
    UPDATE_PRIMARY_TRANSACTION: UPDATE_TRANSACTION,
} = UDPATE_PRIMARY_TRANSACTIONS


const initialState = {
    status: asyncStatus.INITIAL, 
    data: undefined, // data will be an array of objects
    error: ''
};

/* ---------------------- REDUCER FUNCTION --------------------- */
export default function primaryTransactionsReducer(state = initialState, action) {
    const {type, payload} = action; 

    switch(type) {

        case FETCH_REQUEST: {
            return {
                ...state, 
                status: asyncStatus.LOADING
            }
        }
        case FETCH_SUCCESS: {
            // payload must be an array of objects with {id, data} fields
            return { 
                ...state, 
                data: payload
            }
        }
        case FETCH_ERROR: {
            return {
                ...state, 
                error: payload
            }
        }

        
        case ADD_TRANSACTION: {
            return {
                ...state, 
                data: [
                    ...state.data, 
                    payload
                ]
            }
        }

        default: {
            return state;
        }
    }
}