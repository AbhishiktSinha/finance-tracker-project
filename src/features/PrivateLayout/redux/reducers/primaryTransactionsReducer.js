import _ from "lodash";

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
    REMOVE_PRIMARY_TRANSACTION: REMOVE_TRANSACTION,
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
                data: payload, 
                status: asyncStatus.SUCCESS,
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

        /*  ATTENTION: lodash.merge ⤵ 
            merges the sources, 
            with overwriting in the order they are encountered, 
            to the destination 
        */
        case UPDATE_TRANSACTION: {
            const { id, modifiedData } = payload;

            return {
                ...state, 

                data: state.data.map(transaction => {

                    if (id == transaction.id) {

                        return {
                            id: transaction.id,  
                            data: _.merge({}, transaction.data, modifiedData)
                        }
                    }
                    else {
                        return transaction
                    }
                })
            }
        }

        /*  payload: { id }
        */
        case REMOVE_TRANSACTION: {

            const { id: transactionId } = payload;

            // filter it out
            return ({
                ...state,
                data: state.data.filter(
                    ({id})=> (id != transactionId)
                )
            })
        }

        default: {
            return state;
        }
    }
}