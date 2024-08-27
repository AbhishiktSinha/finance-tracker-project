import { FETCH } from "./actions"; 

const initialState = {
    loading: false,
    data: null,
    error: ''
}

const { FETCH_START, FETCH_SUCCESS, FETCH_ERROR } = FETCH;

export default function userDocReducer(state = initialState, action) {
    
    const {type, payload} = action;
    switch(type) {
        case FETCH_START: {
            return {
                ...state, 
                loading: true,
                error: ''
            }
        }
        case FETCH_SUCCESS: {
            return {
                ...state,
                loading: false,
                data: payload.data,
                error: ''
            }
        }
        case FETCH_ERROR: {
            return {
                ...state,
                loading: false,
                error: payload.error
            }
        }
        
        default: 
            return state;
    }
}