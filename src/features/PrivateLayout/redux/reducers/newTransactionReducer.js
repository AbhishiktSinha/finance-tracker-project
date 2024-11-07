import { consoleInfo } from "../../../../console_styles";
import { UPDATE_NEW_TRANSACTION } from "../actions/newTransactionActions";


const initialState = { 
    id: undefined, 
    data: undefined
 };

export default function newTransactionReducer(state=initialState, action) {
    const {type, payload} = action;
    
    
    if (type == UPDATE_NEW_TRANSACTION) {
        consoleInfo('NewTransaction UPDATe')
        
        console.log(payload)
        
        const { id: newTransID, data: newTransData} = payload;

        return {
            ...state, 
            data: newTransData, 
            id: newTransID, 
        }
    }
    else {
        return state;
    }

}