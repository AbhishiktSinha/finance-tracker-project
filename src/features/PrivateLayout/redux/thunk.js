import {FETCH} from './actions'
import { FirestoreCRUD } from '../../../firebase/firestore';
import { consoleError } from '../../../console_styles';

export const fetchUserDocThunk = (uid)=>{

    // return thunk that performs the asynchronous task
    return (dispatch, getState)=>{
        const {FETCH_ERROR, FETCH_START, FETCH_SUCCESS} = FETCH;

        // signify: network call started
        dispatch( {type: FETCH_START} );

        // fetch user doc details from firestore
        try {
            const userDoc = new FirestoreCRUD().getDocData(`users/${uid}`);
            
            // ON SUCCESS
            dispatch( {
                type: FETCH_SUCCESS, 
                payload: userDoc
            } )
        }
        catch(e) {
            consoleError(e.message);
            dispatch({
                type: FETCH_ERROR,
                payload: e.message,
            })
        }
    }
}