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
    REMOVE_PRIMARY_TRANSACTIONS_LIST: REMOVE_TRANSACTIONS_LIST,
} = UDPATE_PRIMARY_TRANSACTIONS


const initialState = {
    status: asyncStatus.INITIAL, 
    data: {
        byId: {}, 
        allIds: [], 
    },
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
            // payload = {byId, allIds}
            return { 
                ...state, 
                data: {
                    byId: payload.byId, 
                    allIds: payload.allIds
                }, 
                status: asyncStatus.SUCCESS,
            }
        }
        case FETCH_ERROR: {
            return {
                ...state, 
                error: payload
            }
        }

        
        /*
            payload: {id, data}
        */
        case ADD_TRANSACTION: {
            const {id : transactionId, data: transactionData} = payload
            return {
                ...state, 
                data: { 
                    byId: {                        
                        ...state.data.byId, 
                        [transactionId]: transactionData
                    }, 
                    allIds: [
                        ...state.data.allIds, 
                        transactionId
                    ]
                 }
            }
        }

        /*  ATTENTION: lodash.merge ⤵ 
            merges the sources, 
            with overwriting in the order they are encountered, 
            to the destination 
        */
        case UPDATE_TRANSACTION: {
            const { id, modifiedData } = payload;

            const transactionData  = state.data.byId[id];

            return {
                ...state, 

                data: {                    

                    ...state.data, 
                    
                    byId: {
                        ...state.data.byId,                         
                        [id]: _.merge({}, transactionData, modifiedData)
                    }
                }
            }
        }

        /*  payload: { id }
        */
        case REMOVE_TRANSACTION: {

            const { id: transactionId } = payload;

            const new_byId = {...state.data.byId};
            delete new_byId[transactionId]


            return {
                ...state, 
                data: {
                    byId: new_byId,
                    allIds: state.data.allIds.filter( id => id != transactionId )
                }
            }
        }


        /* 
            payload: targetTransactionsSet
        */
        case REMOVE_TRANSACTIONS_LIST: {

            const targetTransactionIdSet = payload;

            const newById = Object.fromEntries(
                Object.entries(state.data.byId).filter(
                    ([id,data])=> !targetTransactionIdSet.has(id)
                )
            )

            return {
                ...state, 

                data: {
                    byId: newById, 
                    allIds: state.data.allIds.filter(id => !targetTransactionIdSet.has(id))
                }
            }
            
        }

        default: {
            return state;
        }
    }
}