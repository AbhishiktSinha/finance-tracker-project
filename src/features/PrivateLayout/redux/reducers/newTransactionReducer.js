import { consoleInfo } from "../../../../console_styles";
import { UPDATE_NEW_TRANSACTION } from "../actions/newTransactionActions";


const initialState = { 
    isModified: undefined, // true | false
    modifiedFields: null, // { fieldName: prev_value, ...}
    id: undefined, 
    data: undefined
 };

export default function newTransactionReducer(state=initialState, action) {
    const {type, payload} = action;
    
    
    if (type == UPDATE_NEW_TRANSACTION) {
        consoleInfo('NewTransaction UPDATe')
        
        console.log(payload)
        
        const { id: newTransID, 
            data: newTransData, 
            isModified: newTransIsModified, 
            modifiedFields: newTransModifiedFields} = payload;

        return {
            ...state, 
            data: newTransData, 
            id: newTransID, 
            isModified: newTransIsModified, 
            modifiedFields: newTransModifiedFields
        }
    }
    else {
        return state;
    }

}