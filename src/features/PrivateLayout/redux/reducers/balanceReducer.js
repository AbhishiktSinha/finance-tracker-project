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

        /**
         * payload strucutre:           
         *  {
         *      id: ----, 
         *      data: {
         *              type: //optional ,
         *              currency: ----, 
         *              amount: -------
         *          }
         *  }
         */
        case UPDATE_BALANCE_DATA: {
            consoleInfo('UPDATE_BALANCE call')
            console.log(payload)

            const { id, data: {type, currency: transactionCurr, amount: transactionAmt} } = payload;
            
            // no type is provided --> Initialization case for the particular currency
            if (! Boolean(type)) {
                return {
                    ...state, 

                    data: [

                        ...(state.data ? state.data: []), 

                        payload,
                    ]
                }
            }
            // INCOME Transaction
            else if (type == transactionType.INCOME) {
                // increase the value of the currency of transaction
                return {
                    ...state,
                    data: state.data.map( balanceObj => {

                        const { id: balanceId, data: { amount: balanceAmt } } = balanceObj;

                        // update the data.amount of the target balance object
                        if ( balanceId == id) {
                            
                            return {
                                ...balanceObj, //unchanged field: balanceId

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

                    data: state.data.map(balanceObj=>{

                        const {id: balanceId, data : {amount : balanceAmt}} = balanceObj;

                        // update the data.amount for the targeted balance object
                        if (id == balanceId) {

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
                consoleError(`balanceReducer UPDATE_BALANCE: Invalid 'type' property: ${type}`);
                return state;
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

            if (payload.balanceOperation == balanceOperations.CREATE_AMOUNT) {

                return {
                    ...state, 
                    data: [
                        ...state.data, 
                        {
                            id: payload.id, 
                            data: {
                                currency: payload.id, 
                                amount: payload.amount,
                            }
                        }
                    ]
                }
            }
            else {
                
                return {
                    ...state, 
                    data: state.data.map( balanceObject => {

                        if (balanceObject.id == payload.id) {

                            return {
                                ...balanceObject, 
                                data: {
                                    ...balanceObject.data, 
                                    amount: (payload.balanceOperation == balanceOperations.ADD_AMOUNT ?
                                        balanceObject.data.amount + payload.amount : 
                                        balanceObject.data.amount - payload.amount
                                    )
                                }
                            }
                        }
                        else {
                            return balanceObject
                        }
                    })
                }
            }
        }
        
        default : {
            return state;
        }
    }
}