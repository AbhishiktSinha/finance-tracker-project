import { consoleError, consoleInfo } from "../../../../console_styles";
import { asyncStatus, balanceOperations, transactionType } from "../../../../enums";
import { FETCH_BALANCE, UPDATE_BALANCE as UPDATE } from "../actions/balanceActions"

const { FETCH_BALANCE_DATA_REQUEST: FETCH_DATA_REQUEST,
    FETCH_BALANCE_DATA_SUCCESS: FETCH_DATA_SUCCESS, 
    FETCH_BALANCE_DATA_ERROR: FETCH_DATA_ERROR
} = FETCH_BALANCE;

const {INITIALIZE_BALANCE, UPDATE_BALANCE_DATA, UPDATE_BALANCE_DATA_2} = UPDATE;

const initialState = {
    status: asyncStatus.INITIAL,
    data: {
        byId: {}, 
        allIds: []
    }, 
    error: '',
}

/**Balance Data: [ balanceObj1, balanceObj2, balanceObj3 ]  
 * balanceObj: {  
 *   id: ---,  
 *   data: {  
 *      currency: ---,  
 *      amount: ---,  
 *      lastUpdatedAt: --- //optional  
 *   }  
 * }
*/

export default function balanceReducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {

        case FETCH_DATA_REQUEST : {
            return {
                ...state, 
                status: asyncStatus.LOADING
            }
        }
        case FETCH_DATA_SUCCESS : {
            // payload empty array in case balance subcollection is not found
            return {
                ...state, 
                status: asyncStatus.SUCCESS, 
                data: {
                    byId: payload.byId, 
                    allIds: payload.allIds,
                },
                error: ''
            }
        }
        case FETCH_DATA_ERROR : {
            return { 
                ...state, 
                status: asyncStatus.ERROR,
                error: payload
            }
        }

        /**
         * payload: {id, newAmount}
         * This ACTION replaces the old amount with the new
         * No computation happens here
         */
        case UPDATE_BALANCE_DATA: {
            consoleInfo('UPDATE_BALANCE call')
            console.log(payload)

            const { id, amount: newAmount } = payload;
            
            return {
                ...state, 
                data: {
                    ...state.data, 
                    
                    byId: {
                        ...state.data.byId, 

                        [id]: Boolean(state.data.byId[id]) ?
                            { ...state.data.byId[id], amount: newAmount } :
                            { currency: [id], amount: newAmount}
                    }, 

                    allIds: state.data.byId[id] ?
                        state.data.allIds :
                        [...state.data.allIds, id]
                }
            }
        }

        
        /**
         * payload structure: 
            * {
            *   balanceOperation: ADD_AMOUNT, SUBTRACT_AMOUNT, CREATE_AMOUNT, 
            *   id: ----, 
            *   amount: ---, 
            * }
         */
        case UPDATE_BALANCE_DATA_2: {

            const {balanceOperation, id, amount: operationAmount} = payload

            if (payload.balanceOperation == balanceOperations.CREATE_AMOUNT) {

                return {
                    ...state, 
                    data: {
                        ...state.data, 
                        [id]: {
                            currency: [id], 
                            amount: operationAmount
                        }
                    }
                }
            }
            else {
                
                return {
                    ...state, 
                    data: {
                        ...state.data, 
                        [id]: balanceOperation == balanceOperations.ADD_AMOUNT ? 
                            {...state.data[id], amount: state.data[id].amount - operationAmount} :
                            {...state.data[id], amount: state.data[id].amount + operationAmount}
                    }
                }
            }
        }
        
        default : {
            return state;
        }
    }
}