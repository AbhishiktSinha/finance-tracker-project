import { consoleDebug } from "../../../console_styles";
import { FETCH } from "./actions"; 

const initialState = {
    status: 'initial', // initial | loading | success | failure
    data: null,
    error: ''
}

const { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_ERROR } = FETCH;

export default function userDocReducer(state = initialState, action) {

    consoleDebug('IN userDOC REDUCER');
    console.log(state, action)
    
    const {type, payload} = action;
    switch(type) {
        case FETCH_DATA_REQUEST: {
            return {
                ...state, 
                status: 'loading',
                error: ''
            }
        }
        case FETCH_DATA_SUCCESS: {
            return {
                ...state,
                status: 'success',
                data: payload.data,
                error: ''
            }
        }
        case FETCH_DATA_ERROR: {
            return {
                ...state,
                status: 'failure',
                error: payload.error
            }
        }
        
        default: 
            return state;
    }
}