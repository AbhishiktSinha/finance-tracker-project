import { consoleDebug } from "../../../../console_styles";
import { asyncStatus } from "../../../../enums";
import { FETCH_USERDOC as FETCH, UPDATE_USERDOC as UPDATE } from "../actions/userDocActions"; 

const initialState = {
    status: asyncStatus.INITIAL, // initial | loading | success | failure
    data: null,
    error: ''
}

const { FETCH_USERDOC_DATA_REQUEST, FETCH_USERDOC_DATA_SUCCESS, FETCH_USERDOC_DATA_ERROR } = FETCH;
const { UPDATE_USERDOC_DATA, UPDATE_USERDOC_SETTINGS } = UPDATE;

export default function userDocReducer(state = initialState, action) {

    consoleDebug('IN userDOC REDUCER');
    console.log(state, action)
    
    const {type, payload} = action;
    switch(type) {

        case FETCH_USERDOC_DATA_REQUEST: {
            return {
                ...state, 
                status: asyncStatus.LOADING,
                error: ''
            }
        }
        case FETCH_USERDOC_DATA_SUCCESS: {  
            return {
                ...state,
                status: asyncStatus.SUCCESS,
                data: payload,
                error: ''
            }
        }
        case FETCH_USERDOC_DATA_ERROR: {
            return {
                ...state,
                status: asyncStatus.ERROR,
                error: payload
            }
        }

        case UPDATE_USERDOC_DATA: {
            
            return {
                ...state, 
                data: {
                    ...state.data,
                    ...payload
                }
            }
        }
        case UPDATE_USERDOC_SETTINGS: {
            return {
                ...state, 
                data: {
                    ...state.data, 
                    settings: {
                        ...state.data.settings, 
                        ...payload,
                    }
                }
            }
        }
        
        
        default: 
            return state;
    }
}