import { FETCH_USERDOC, UPDATE_USERDOC } from './actions/userDocActions'
import { FETCH_BALANCE, UPDATE_BALANCE } from './actions/balanceActions';
import { FETCH_TAG } from './actions/tagActions';

import { selectDefaultCurrency } from './selectors';

import { FirestoreCRUD } from '../../../firebase/firestore';
import { consoleDebug, consoleError, consoleInfo, consoleSucess } from '../../../console_styles';

import ExchangeRateAPI from '../../../exchangeRate_api';

import UserDocError from '../../../custom_errors/UserDocError'
import BalanceError from '../../../custom_errors/BalanceError'
import TagError from '../../../custom_errors/TagError'
import InitializerError from '../../../custom_errors/InitializerError'

export const fetchUserDocThunk = (uid) => {

    consoleDebug('thunk wrapper')
    // return thunk that performs the asynchronous task
    return async (dispatch, getState) => {
        consoleDebug('USERDOC THUNK')
        const { FETCH_USERDOC_DATA_ERROR: FETCH_DATA_ERROR, FETCH_USERDOC_DATA_REQUEST: FETCH_DATA_REQUEST, FETCH_USERDOC_DATA_SUCCESS: FETCH_DATA_SUCCESS } = FETCH_USERDOC;

        // signify: network call started
        dispatch({ type: FETCH_DATA_REQUEST });

        // fetch user doc details from firestore
        try {
            const userDoc = await new FirestoreCRUD().getDocData(`users/${uid}`); 

            // ON SUCCESS
            dispatch({
                type: FETCH_DATA_SUCCESS,
                payload: userDoc
            })

        }
        catch (e) {
            consoleError(e.message);
            dispatch({
                type: FETCH_DATA_ERROR,
                payload: e.message,
            })
        }
    }
}

/** THUNK to update the userDoc with the balace data.
 * 
 * On successful firestore update, reflect the changes in the redux store
 */
export const updateOnboardingDataThunk = function (uid, data) {

    return async (dispatch) => {

        const { defaultCurrency: currency, balance:amount } = data;
        console.log('updateOnboardinDataThunk data recieved:', currency, amount)
        try {
            
            await new FirestoreCRUD().batchWrite([
                {
                    operationType: 'update', 
                    docPath: `users/${uid}/`,
                    data: { settings: { defaultCurrency : currency} }
                },
                {
                    operationType: 'set',
                    docPath: `users/${uid}/balance/${currency}`,
                    data: { 
                        currency: currency, 
                        amount: Number(amount)
                    }
                }
            ])

            dispatch({
                type: UPDATE_BALANCE.UPDATE_BALANCE,
                payload: {
                    id: currency, 
                    data: {
                        currency: currency, 
                        amount: Number(amount),
                    }
                }

            })
            /* FIXME: replaces the entire userDoc data */
            dispatch({
                type: UPDATE_USERDOC.UPDATE_USERDOC_SETTINGS,
                payload: {
                    defaultCurrency: currency
                }
            })
        }
        catch (e) {
            throw e;
        }
    }

}

/**(DEPRECATED) THUNK to handle conditional updates to the exchangeRate data stored in localStorage
 * This thunk middleware function does note deal with application state updates
 * 
 * This operation is handled in a thunk of the dashboard for the following reasons: 
 *  1. Avoid direct dependency of the dashboard component on the defaultCurrency
 *  2. Selectors can be used without any controversy in thunks 
 */
export const updateExchangeRateThunk = ()=>{

    consoleInfo('updateExchangeRate ----T H U N K---- WRAPPER')

    return async (dispatch, getState)=> {

        consoleInfo('thunk to update exchange rate in localStorage')
        consoleDebug(`exhangeRate exists: ${Boolean(localStorage.getItem('exchangeRate'))}`)

        
        try {
            // run prior checks before calling the exchange-rate-api
            exchangeRateUpdatePriorCheck()

            const state = getState();
            await ExchangeRateAPI.updateExchangeRate(selectDefaultCurrency(state), 'force')

        }catch(e) {
            consoleError(e);
        }
    
    }
}


/**THUNK TO FETCH THE TAGS FROM `FIRESTORE` */
export const fetchTagsThunk = (uid)=>{
    
    const {FETCH_TAG_DATA_REQUEST, 
        FETCH_TAG_DATA_ERROR, 
        FETCH_TAG_DATA_SUCCESS} = FETCH_TAG;

    return async (dispatch, getState)=>{

        const tagsStatus = getState().tags.status; 
        if (tagsStatus == 'success') {
            consoleInfo('TAG DATA ALREADY PRESENT');
            return;
        }
        
        // INDICATE REQUEST STARTED
        dispatch({
            type: FETCH_TAG_DATA_REQUEST
        });

        try {
            // FETCH THE GLOBAL TAGS and CUSTOM TAGS    
            const [globalTags, customTags] = await Promise.all([
                fetchGlobalTags(),
                fetchCustomTags()
            ])
            
            const tagsList = [...globalTags, ...customTags];

            // ON SUCCESS
            /*Data Modification -- ESCHEWED TEMPORARILY
                the tags are fetched as an array of objects
                re-structure the data to an object 
                    {
                        tagID: tagObject
                    }
            */
            dispatch({
                type: FETCH_TAG_DATA_SUCCESS,
                payload: tagsList,
                /* payload: tagsList.reduce((accumulator, currTag)=>{
                    return {
                        ...accumulator,
                        [currTag.id] : currTag.data,
                    }
                }, {}) */                
            })
        }
        catch(e) {
            consoleError(e);
            dispatch({
                type: FETCH_TAG_DATA_ERROR,
                payload: e.message,
            })
        }



    }

    async function fetchGlobalTags() {
        return await new FirestoreCRUD().
            getDocsData('tags')
    }
    async function fetchCustomTags() {
        return await new FirestoreCRUD().
            getDocsData(`users/${uid}/customTags`)
    }
}

/**
 * 
 * @param {string} uid The User's UID provided as an argument
 * @returns thunk to fetch the essential stateful data from the Firestore
 */
export const stateInitializerThunk = (uid)=> {
    
    async function fetchUserDoc() {
        try {
            return await new FirestoreCRUD().getDocData(`users/${uid}`);
        } catch(e) {
            throw new UserDocError('Failed to retrieve "userDoc"');
        }
    }
    async function fetchBalance() {
        try {
            return await new FirestoreCRUD().getDocsData(
                `users/${uid}/balance`
            )
        } catch(e) {
            throw new BalanceError('Failed to retrieve "balance"');
        }
    }
    async function fetchTags() {
        async function fetchGlobalTags() {
            return await new FirestoreCRUD().
                getDocsData('tags')
        }
        async function fetchCustomTags() {
            return await new FirestoreCRUD().
                getDocsData(`users/${uid}/customTags`)
        }

        try {
            return await Promise.all([
                fetchGlobalTags(),
                fetchCustomTags()
            ])
        }
        catch(e) {
            throw new TagError('Failed to retrieve "tags"')
        }
    }


    /* throw any error back to the caller to facilitate ui update */
    return async (dispatch, getState)=>{
        
        const { FETCH_USERDOC_DATA_ERROR, 
            FETCH_USERDOC_DATA_REQUEST, 
            FETCH_USERDOC_DATA_SUCCESS } = FETCH_USERDOC;

        const { FETCH_TAG_DATA_REQUEST,
            FETCH_TAG_DATA_ERROR,
            FETCH_TAG_DATA_SUCCESS } = FETCH_TAG;

        const {FETCH_BALANCE_DATA_REQUEST,
            FETCH_BALANCE_DATA_SUCCESS, 
            FETCH_BALANCE_DATA_ERROR } = FETCH_BALANCE

        try {
            /* ------- loading ------------ */
            dispatch( { type: FETCH_BALANCE_DATA_REQUEST } );
            dispatch( { type: FETCH_TAG_DATA_REQUEST } );
            dispatch( { type: FETCH_USERDOC_DATA_REQUEST } );

            const [userDocData, tagData, balanceData] = await Promise.all([
                fetchUserDoc(),
                fetchTags(),
                fetchBalance(),
            ])

            /* ------- success ---------------- */
            consoleSucess(`FETCHED: USERDOC, TAG & BALANCE`);
            dispatch( { type: FETCH_USERDOC_DATA_SUCCESS, payload: userDocData } );
            dispatch( { type: FETCH_BALANCE_DATA_SUCCESS, payload: balanceData });
            dispatch( { type: FETCH_TAG_DATA_SUCCESS, payload: tagData } );
        }
        /* ----------- error ------------------ */
        catch(e) {
            consoleError(e);
            if (e instanceof BalanceError) {
                dispatch( { type: FETCH_BALANCE_DATA_ERROR, payload: e.message});
            }
            else if (e instanceof TagError)  {
                dispatch( { type: FETCH_TAG_DATA_ERROR, payload: e.message});
            }
            else if (e instanceof UserDocError) {
                dispatch( {type: FETCH_USERDOC_DATA_ERROR, payload: e.message});
            }

            throw new InitializerError('State Initialization Failed');
        }
    }
}