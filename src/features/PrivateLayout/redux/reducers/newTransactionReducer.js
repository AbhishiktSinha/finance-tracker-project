import { UPDATE } from "../actions/newTransactionActions";

const {UPDATE_NEW_TRANSACTION} = UPDATE;

const initialState = { data: undefined };

export default function newTransactionReducer(state=initialState, action) {
    const {type, payload} = action;

    if (type == UPDATE_NEW_TRANSACTION) {
        return {
            ...state, 
            data: payload
        }
    }
    else {
        return state;
    }

}