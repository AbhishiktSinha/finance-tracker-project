import { consoleError } from "../../../../console_styles";
import { asyncStatus, transactionType } from "../../../../enums";
import { FETCH_BALANCE, UPDATE_BALANCE as UPDATE } from "../actions/balanceActions"

const { FETCH_BALANCE_DATA_REQUEST: FETCH_DATA_REQUEST,
    FETCH_BALANCE_DATA_SUCCESS: FETCH_DATA_SUCCESS, 
    FETCH_BALANCE_DATA_ERROR: FETCH_DATA_ERROR
} = FETCH_BALANCE;

const {INITIALIZE_BALANCE, UPDATE_BALANCE} = UPDATE;

const initialState = {
    status: asyncStatus.INITIAL,
    data: undefined, 
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
                data: payload,
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


        case UPDATE_BALANCE: {

            const {data: { type, currency: transactionCurr, amount: transactionAmt}} = payload;
            
            // no type is provided --> Initialization case
            if (! Boolean(type)) {
                return {
                    ...state, 
                    data: [
                        payload
                    ]
                }
            }
            // INCOME Transaction
            else if (type == transactionType.INCOME) {
                // increase the value of the currency of transaction
                return {
                    ...state,
                    data: data.map( balanceObj => {

                        const { id, data: { amount: balanceAmt } } = balanceObj;

                        // update the data.amount of the target balance object
                        if (id == transactionCurr) {
                            
                            return {
                                ...balanceObj, //unchanged field: id

                                data: {
                                    ...balanceObj.data, //unchanged fields: currency, lastUpdateAt, ... etc
                                    amount: balanceAmt + transactionAmt,
                                }
                            }
                        }
                        else {
                            return balanceObj;
                        }
                    })
                }
            }
            // EXPENDITURE Transaction
            else if(type == transactionType.EXPENDITURE) {
                
                // decrease the value of the currency of transaction
                // assume prior checks already executed
                return {
                    ...state, 

                    data: data.map(balanceObj=>{

                        const {id, data : {amount : balanceAmt}} = balanceObj;

                        // update the data.amount for the targeted balance object
                        if (id == transactionCurr) {

                            return {
                                ...balanceObj, 
                                
                                data: {
                                    ...balanceObj.data, 
                                    amount: balanceAmt - transactionAmt,
                                }
                            }
                        }
                        else {
                            return balanceObj;
                        }
                    } )
                }
            }
            else {
                consoleError(`Invalid 'type' property: ${type}`);
                return state;
            }
        }
        default : {
            return state;
        }
    }
}