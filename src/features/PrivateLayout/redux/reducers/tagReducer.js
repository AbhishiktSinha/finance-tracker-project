import { asyncStatus } from '../../../../enums';
import {FETCH_TAG as FETCH, UPDATE_TAG} from '../actions/tagActions'

const {
    FETCH_TAG_DATA_REQUEST: FETCH_DATA_REQUEST, 
    FETCH_TAG_DATA_ERROR: FETCH_DATA_ERROR,
    FETCH_TAG_DATA_SUCCESS: FETCH_DATA_SUCCESS,
} = FETCH;

const {
    MODIFY_TAG, 
    DELETE_TAG, 
    ADD_TAG
} = UPDATE_TAG

const initialState = {
    status: asyncStatus.INITIAL, //initial | loading | success | error
    data: undefined,
    error: '',
}

export default function tagReducer(state=initialState, action) {
    const {type, payload} = action;

    switch (type) {
        
        case FETCH_DATA_REQUEST : {
            return {
                ...state, 
                status: asyncStatus.LOADING
            }
        }
        case FETCH_DATA_SUCCESS: {
            return {
                ...state, 
                status: asyncStatus.SUCCESS,
                data: payload,
            }
        }
        case FETCH_DATA_ERROR: {
            return {
                ...state, 
                status: asyncStatus.ERROR,
                error: payload
            }
        }
        default : {
            return state;
        }
    }
}