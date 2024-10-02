import {FETCH_TAG as FETCH, MANIPULATE} from '../actions/tagActions'

const {
    FETCH_TAG_DATA_REQUEST: FETCH_DATA_REQUEST, 
    FETCH_TAG_DATA_ERROR: FETCH_DATA_ERROR,
    FETCH_TAG_DATA_SUCCESS: FETCH_DATA_SUCCESS,
} = FETCH;

const {
    UPDATE_TAG, 
    DELETE_TAG, 
    ADD_TAG
} = MANIPULATE

const initialState = {
    status: 'initial', //initial | loading | success | error
    data: undefined,
    error: '',
}

export default function tagReducer(state=initialState, action) {
    const {type, payload} = action;

    switch (type) {
        
        case FETCH_DATA_REQUEST : {
            return {
                ...state, 
                status: 'loading'
            }
        }
        case FETCH_DATA_SUCCESS: {
            return {
                ...state, 
                data: payload,
            }
        }
        case FETCH_DATA_ERROR: {
            return {
                ...state, 
                data: payload
            }
        }
        default : {
            return state;
        }
    }
}