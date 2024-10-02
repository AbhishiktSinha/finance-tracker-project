import { FETCH_BALANCE, UPDATE } from "../actions/balanceActions"

const { FETCH_BALANCE_DATA_REQUEST: FETCH_DATA_REQUEST,
    FETCH_BALANCE_DATA_SUCCESS: FETCH_DATA_SUCCESS, 
    FETCH_BALANCE_DATA_ERROR: FETCH_DATA_ERROR
} = FETCH_BALANCE;

const {INITIALIZE_BALANCE} = UPDATE;

const initialState = {
    status: 'initial',
    data: undefined, 
    error: '',
}

export default function balanceReducer(state = initialState, action) {
    const {type, payload} = action

    switch(type) {

        case FETCH_DATA_REQUEST : {
            return {
                ...state, 
                status: 'loading'
            }
        }
        case FETCH_DATA_SUCCESS : {
            // payload empty array in case balance subcollection is not found
            return {
                ...state, 
                status: 'success', 
                data: payload,
                error: ''
            }
        }
        case FETCH_DATA_ERROR : {
            return { 
                ...state, 
                status: 'error',
                error: payload
            }
        }

        case INITIALIZE_BALANCE : {

            return {
                ...state, 
                data: [
                    ...state.data,
                    payload
                ]
            }
        }
        default : {
            return state;
        }
    }
}