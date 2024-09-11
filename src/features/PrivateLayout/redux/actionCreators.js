import {FETCH, UPDATE} from './actions'

/* --------- UPDATE actionCreators --------- */
const { UPDATE_USER_DATA } = UPDATE;

export const updateUserData = (payload)=>{
    return {
        type: UPDATE_USER_DATA,
        payload: payload
    }
}