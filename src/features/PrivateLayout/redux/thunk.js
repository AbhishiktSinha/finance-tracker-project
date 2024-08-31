import {FETCH} from './actions'
import { FirestoreCRUD } from '../../../firebase/firestore';
import { consoleDebug, consoleError } from '../../../console_styles';

export const fetchUserDocThunk = (uid)=>{

    consoleDebug('thunk wrapper')
    // return thunk that performs the asynchronous task
    return async(dispatch, getState)=>{
        consoleDebug('USERDOC THUNK')
        const {FETCH_DATA_ERROR, FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS} = FETCH;

        // signify: network call started
        dispatch( {type: FETCH_DATA_REQUEST} );

        // fetch user doc details from firestore
        try {
            const userDoc = await new FirestoreCRUD().getDocData(`users/${uid}`);
            
            // ON SUCCESS
            dispatch( {
                type: FETCH_DATA_SUCCESS, 
                payload: userDoc
            } )
        }
        catch(e) {
            consoleError(e.message);
            dispatch({
                type: FETCH_DATA_ERROR,
                payload: e.message,
            })
        }
    }
}