import { FETCH_USERDOC, UPDATE_USERDOC } from './actions/userDocActions'
import { FETCH_BALANCE, UPDATE_BALANCE } from './actions/balanceActions';
import { FETCH_PRIMARY_TRANSACTIONS } from './actions/primaryTransactionsActions';
import { UPDATE_NEW_TRANSACTION } from './actions/newTransactionActions'
import { FETCH_TAG, UPDATE_TAG } from './actions/tagActions';

import { selectDefaultCurrency } from './selectors';

import { FirestoreCRUD } from '../../../firebase/firestore';
import { consoleDebug, consoleError, consoleInfo, consoleSucess } from '../../../console_styles';


import UserDocError from '../../../custom_errors/UserDocError'
import BalanceError from '../../../custom_errors/BalanceError'
import TagError from '../../../custom_errors/TagError'
import InitializerError from '../../../custom_errors/InitializerError'
import PrimaryTransactionsError from '../../../custom_errors/PrimaryTransactionsError'
import endpoints from '../../../network/endpoints';
import request from '../../../network/request';
import { rules } from 'eslint-plugin-react';
import { dayJsUnits, transactionType } from '../../../enums';
import { batch } from 'react-redux';
import { DayJSUtils } from '../../../dayjs';

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

/**THUNK to handle conditional updates to the exchangeRate data stored in localStorage
 * This thunk middleware function does not deal with application state updates
 * 
 * This operation is handled in a thunk of the PrivateLayout for the following reasons: 
 *  1. Avoid direct dependency of the PrivateRoute on the defaultCurrency
 *  2. Selectors can be used without any controversy in thunks 
 */
export const updateExchangeRateThunk = (flag)=>{

    consoleInfo('updateExchangeRate ----T H U N K---- WRAPPER')

    function check_update_required() {
        // if pre-existing exchangeRate data is found in localStorage
        if (Boolean(localStorage.getItem('exchangeRate'))) {

            const time_next_update = JSON.parse(localStorage.getItem('exchangeRate'))?.time_next_update;
            const margin = 500; //ms
            const time_now = new Date().getTime();
            
            if (time_next_update && ( time_now < time_next_update - margin ) ) {
                consoleError(`API Call aborted, time_next_udpate: ${new Date(time_next_update)}`)
                return false
            }
            else {
                return true;
            }
        }
        // otherwise, fetching of data is necessary 
        else {
            return true;
        }
    }

    return async (dispatch, getState)=> {
        
        const {code: defaultCurrencyCode} = selectDefaultCurrency(getState());

        // prior check by default
        if (flag != 'force') {
            const update_required = check_update_required();
            
            // abort if update is not required
            if (!update_required) {
                return
            }
        }

        /* PREPARING FOR NETWORK CALL */

        const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
        const httpConfig = {
            method: 'GET',
            url: `${endpoints.baseUrl_exchangeRate}/${apiKey}/latest/${defaultCurrencyCode}`
        }

        /* ----------------- NETWORK CALL HERE --------------------------- */
        const { success, data, error } = await request(httpConfig)

        if (success) {
            const {
                time_last_update_utc: time_last_update,
                time_next_update_utc: time_next_update,
                base_code: defaultCurrency,
                conversion_rates
            } = data.data;

            localStorage.setItem('exchangeRate',
                JSON.stringify(
                    {
                        time_last_update: new Date(time_last_update).getTime(),
                        time_next_update: new Date(time_next_update).getTime(),
                        defaultCurrency: defaultCurrency,
                        conversion_rates: conversion_rates
                    }
                )
            )
            // returns without error
        }
        else {
            throw error;
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

/** THUNK TO INITIALIZE THE PRIVATE LAYOUT STATE
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
            const [globalTags, customTags] = await Promise.all([
                fetchGlobalTags(),
                fetchCustomTags()
            ])

            return [...globalTags, ...customTags];
        }
        catch(e) {
            throw new TagError('Failed to retrieve "tags"')
        }
    }
    
    async function fetchPrimaryTransactions() {
        try {
            const previousTimestampLimit = DayJSUtils.getValueAfterInterval(
                DayJSUtils.getLoginTimeStamp(), 
                {intervalType: dayJsUnits.YEAR, intervalDuration: 1}, 
                false);
            
            return await new FirestoreCRUD().
                getDocsData(
                    `users/${uid}/transactions`, 
                    [
                        {
                            key: 'timestamp.occurredAt', 
                            relationship: '<=', 
                            value: DayJSUtils.getLoginTimeStamp()
                        }, 
                        {
                            key: 'timestamp.occurredAt', 
                            relationship: '>=', 
                            value: previousTimestampLimit
                        }
                    ]
                )
        }
        catch(e) {
            consoleError(e.message);
            throw new PrimaryTransactionsError(e.message);
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

        const { FETCH_PRIMARY_TRANSACTIONS_REQUEST, 
            FETCH_PRIMARY_TRANSACTIONS_SUCCESS, 
            FETCH_PRIMARY_TRANSACTIONS_ERROR } = FETCH_PRIMARY_TRANSACTIONS;

        try {
            /* ------- loading ------------ */
            dispatch( { type: FETCH_BALANCE_DATA_REQUEST } );
            dispatch( { type: FETCH_TAG_DATA_REQUEST } );
            dispatch( { type: FETCH_USERDOC_DATA_REQUEST } );
            dispatch( { type: FETCH_PRIMARY_TRANSACTIONS_REQUEST})

            const [userDocData, tagData, balanceData, primaryTransactionsData] = await Promise.all([
                fetchUserDoc(),
                fetchTags(),
                fetchBalance(),
                fetchPrimaryTransactions()
            ])

            /* ------- success ---------------- */
            consoleSucess(`FETCHED: USERDOC, TAG, PRIMARY_TRANSACTIONS & BALANCE`);

            dispatch( { type: FETCH_USERDOC_DATA_SUCCESS, payload: userDocData } );
            dispatch( { type: FETCH_BALANCE_DATA_SUCCESS, payload: balanceData });
            dispatch( { type: FETCH_TAG_DATA_SUCCESS, payload: tagData } );
            dispatch( {type: FETCH_PRIMARY_TRANSACTIONS_SUCCESS, payload: primaryTransactionsData});
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
            else if (e instanceof PrimaryTransactionsError) {
                dispatch( {type: FETCH_PRIMARY_TRANSACTIONS_ERROR, payload: e.message})
            }
            
            throw new InitializerError('State Initialization Failed');
        }
    }
}

export const createTagThunk = (uid, data)=>{
    
    const {CREATE_TAG} = UPDATE_TAG

    return async (dispatch, getState)=>{

        try {

            const {id} = await new FirestoreCRUD().createNewDoc(
                `users/${uid}/customTags`, 
                data
            )

            dispatch({
                type: CREATE_TAG, 
                payload: {
                    id: id, 
                    data: data
                }
            })
        }
        catch(e) {            
            throw new Error(e);
        }
    }
}


/**THUNK to handle creating / updating financial transactions  
 * This thunk uses Firestore Transactions to read data from `balance` and `transactions` collections and udpates data accordingly  
 *   
 * Post data udpate on the backend this thunk deals with application state updates 
 * by firing dispatches to update the `balance` and `newTransaction` state in Redux store  
 *   
 * The dispatchCallback callback recieved as an argument is used to make the dispatch call to udpate the appropriate transaction state slice in redux
 * 
 * @param {string} uid 
 * @param {object} data 
 * @param {(dispatch: Function, transactionData: object)=>void} dispatchCallback
 * @returns Promise<void>
 */
export const updateTransactionThunk = (uid, data, dispatchCallback)=>{

    // RECIEVED DATA DOESN'T REQUIRE FURTHER MODIFICATION

    const {UPDATE_BALANCE: UPDATE_BALANCE_DATA} = UPDATE_BALANCE;

    const payloadObject = {};
    
    return async (dispatch, getState)=>{

        const getTransactionId = (transactionData)=>{
            
            if (transactionData.id) {
                return transactionData.id;
            }
            else {
                return new FirestoreCRUD().getRandomDocID(`users/${uid}/transactions`);
            }
        }
        const getTransactionData = (transactionData)=>{
            const {id, ...restData} = transactionData;
            return restData;
        }
        const transactionId = getTransactionId(data);
        const transactionData = getTransactionData(data);

        try { 
            
            await new FirestoreCRUD().firestoreTransaction(
                [
                    // ----------------------------------transaction
                    {
                        // docs to read
                        docPathDependencies: [`users/${uid}/transactions/${transactionId}`],                         

                        transactionConditionFunction: (docSnapDependencies)=>{

                            // EDIT/CREATE --> Both: id & data are needed.
                            payloadObject.transactionData = {
                                    id: transactionId, 
                                    data: transactionData
                                }

                            const [transactionDocSnap, ...restDocSnaps] = docSnapDependencies; 

                            // if existing financial transaction doc is being updated
                            if (transactionDocSnap.exists()) {                                

                                return {
                                    commit: true, 
                                    operation: 'set', 
                                    option: {merge: true}, 
                                    data: transactionData, 
                                    targetDocPath: `users/${uid}/transactions/${transactionId}`,
                                }
                            }
                            // if new financial Transaction is being created
                            else {                                
                                
                                return {
                                    commit: true, 
                                    operation: 'set', 
                                    data: transactionData,
                                    targetDocPath: `users/${uid}/transactions/${transactionId}`,
                                }
                            }

                        }
                    }, 
                    // --------------------------------balance
                    {
                        docPathDependencies: [`users/${uid}/balance/${transactionData.currency}`],                        
                        
                        transactionConditionFunction: (docSnapDependencies)=>{
                            
                            const [balanceDocSnap, ...restDocSnaps] = docSnapDependencies;
                            const {type, amount, currency} = transactionData

                            // if balance document exists
                            if (balanceDocSnap.exists()) {

                                const balanceAmount = balanceDocSnap.data().amount;
                                const newAmount = type == transactionType.INCOME ? 
                                    balanceAmount + amount :
                                    balanceAmount - amount;

                                // application state
                                payloadObject.balanceData = {type, amount, currency}

                                // firestore
                                return {
                                    commit: true, 
                                    operation: 'set', 
                                    option: {merge: true}, 
                                    data: { amount: newAmount },
                                    targetDocPath: `users/${uid}/balance/${transactionData.currency}`,
                                }
                            }
                            // if balance document does NOT exist
                            else {

                                payloadObject.balanceData = {amount, currency};

                                return {
                                    commit: true, 
                                    operation: 'set', 
                                    data: {
                                        amount: amount, 
                                        currency: currency
                                    },
                                    targetDocPath: `users/${uid}/balance/${transactionData.currency}`,
                                }
                            }
                        }
                    }
                ]
            )

            batch(() => {

                // update the BALANCE state
                consoleInfo('dispatch -> UPDATE_BALANCE_DATA')
                dispatch({
                    type: UPDATE_BALANCE_DATA,
                    payload: {
                        id: transactionData.currency, 
                        data: payloadObject.balanceData
                    }
                })

                // update the NEW_TRANSACTION state
                consoleInfo('dispatch -> UDPATE_NEW_TRANSACTION')
                dispatch({
                    type: UPDATE_NEW_TRANSACTION,
                    payload: {
                        id: transactionId,
                        data: transactionData
                    }
                })

                // use the parametric callback to update transactions
                // could be update, could be create
                dispatchCallback && dispatchCallback(dispatch, payloadObject.transactionData)
            })
        }
        catch(e) {
            // the operation of this thunk affects the UI
            throw e;
        }
    }
}




export const transactionManagementThunk = (uid, modification, formFields, modifiedFields)=> {

    
}