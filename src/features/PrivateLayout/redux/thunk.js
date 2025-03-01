import { FETCH_USERDOC, UPDATE_USERDOC } from './actions/userDocActions'
import { FETCH_BALANCE, UPDATE_BALANCE } from './actions/balanceActions';
import { FETCH_PRIMARY_TRANSACTIONS, UDPATE_PRIMARY_TRANSACTIONS } from './actions/primaryTransactionsActions';
import { UPDATE_NEW_TRANSACTION } from './actions/newTransactionActions'
import { FETCH_TAG, UPDATE_TAG } from './actions/tagActions';

import { selectDefaultCurrency, selectUserSettings } from './selectors';

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
import { balanceOperations, dayJsUnits, timeframe, transactionType } from '../../../enums';
import { batch } from 'react-redux';
import { DayJSUtils } from '../../../dayjs';
import dayjs, { Dayjs } from 'dayjs';
import { flushSync } from 'react-dom';
import defaults from '../defaults';
// import { selectPrimaryTransactionsList, selectTransactionsInitializer_wrapper } from '../pages/Dashboard/redux/selectors';

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
                type: UPDATE_BALANCE.UPDATE_BALANCE_DATA,
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

    consoleDebug('----------------- initializer THUNK fired 🚀--------------')
    
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


export const changeDefaultCurrencyThunk = (uid, data)=> {

    const { UPDATE_USERDOC_SETTINGS } = UPDATE_USERDOC;

    return async function thunkFunction(dispatch, getState) {
        
        const currentSettings = selectUserSettings(getState());

        try {
            
            await new FirestoreCRUD().updateDocData(
                `users/${uid}`, 
                {
                    'settings.defaultCurrency': data
                }
            )

            dispatch({
                type: UPDATE_USERDOC_SETTINGS, 
                payload: {
                    defaultCurrency: data
                }
            })
        }
        catch(e) {
            consoleError(e);
            console.info(e);
            return e;
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

    const {UPDATE_BALANCE_DATA: UPDATE_BALANCE_DATA} = UPDATE_BALANCE;

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


// TODO: ------->>> newTransaction <<<----------- //
/* ------------- separate : createTransactionThunk & modifyTransactionThunk ------------ */

export const createTransactionThunk = (uid, formFields, modifiedFields, extraWork)=>{

    const { INITIALIZE_BALANCE, UPDATE_BALANCE_DATA, UPDATE_BALANCE_DATA_2 } = UPDATE_BALANCE;
    const { UPDATE_PRIMARY_TRANSACTION, ADD_PRIMARY_TRANSACTION } = UDPATE_PRIMARY_TRANSACTIONS;

    const now = dayjs().valueOf();

    return async function thunkFunction(dispatch, getState) {

        const getTransactionData = ()=>{
            
            const transactionData = { ...formFields };
            delete transactionData['occurredAt'];

            transactionData.timestamp = {
                createdAt: now, 
                modifiedAt: now, 
                occurredAt: formFields.occurredAt
            }
            return transactionData;
        }

        const getTransactionId = ()=>{
            return new FirestoreCRUD().getRandomDocID(`users/${uid}/transactions`);
        }
        
        //#region DEPRECATED
        /* const payloadObj = {
            transactionPayload: null, 
            balancePayload: null, 
        } */
        //#endregion


        const actionObject = {
            transactionActionObject: null, 
            balanceActionObject: null
        }
        
        const transactionData = getTransactionData();
        const transactionId = getTransactionId();

        /* -------------- FIRESTORE UDPATE ====== firestore transaction ===== ---------- */
        try {
            
            await new FirestoreCRUD().firestoreTransaction([
                
                /* ---------- financial-transaction -------- */
                {
                    docPathDependencies: [ `users/${uid}/transactions/${transactionId}`], 

                    transactionConditionFunction(docSnapDependencies) {

                        const [transactionDocSnap, ...rest] = docSnapDependencies;

                        // creation case ---> transaction doc does not exist

                        
                        // if the created transaction qualifies as a primary_transaction
                        if (DayJSUtils.isWithinTimeframe( defaults.primaryTransactionsTimeframe, 
                            transactionData.timestamp.occurredAt, 0 )) {

                                
                                actionObject.transactionActionObject = {
                                    type: ADD_PRIMARY_TRANSACTION, 
                                    payload: {
                                        id: transactionId, 
                                        data: transactionData
                                    }
                            }
                        }
                        
                        return {
                            commit: true, 
                            operation: 'set', 
                            data: transactionData, 
                            targetDocPath: `users/${uid}/transactions/${transactionId}`
                        }
                    }
                }, 

                /* --------------- balance update ---------- */
                {
                    docPathDependencies: [`users/${uid}/balance/${transactionData.currency}`], 
                    
                    transactionConditionFunction(docSnapDependencies) {
                        
                        const [balanceDocSnap, ...rest] = docSnapDependencies;

                        // ----------------------- balance doc EXISTS
                        if (balanceDocSnap.exists()) {
                            // update balance case

                            const balanceData = balanceDocSnap.data();

                            const currentAmount = balanceData.amount;
                            const newAmount = transactionData.type == transactionType.INCOME ? 
                                currentAmount + transactionData.amount : 
                                currentAmount - transactionData.amount ;

                            //#region DEPRECATED
                            /* payloadObj.balancePayload = {
                                
                                ...(transactionData.type == transactionType.INCOME ? 
                                    {balanceAction: balanceOperations.ADD_AMOUNT} : 
                                    {balanceAction: balanceOperations.SUBTRACT_AMOUNT}
                                ), 
                                amount: transactionData.amount
                            } */
                           //#endregion

                            actionObject.balanceActionObject = {
                                type: UPDATE_BALANCE_DATA_2, 
                                payload: {
                                    id: transactionData.currency, 

                                    balanceOperation: (transactionData.type == transactionType.INCOME ?
                                        balanceOperations.ADD_AMOUNT :
                                        balanceOperations.SUBTRACT_AMOUNT
                                    ), 

                                    amount: transactionData.amount
                                }
                            }

                            return {
                                commit: true, 
                                operation: 'set', 
                                option: {merge: true}, 
                                data: {amount: newAmount},
                                targetDocPath: `users/${uid}/balance/${transactionData.currency}`
                            }
                        }
                        // --------------------- balance doc DOES NOT EXIST
                        else {

                            // #region DEPRECATED
                            /* payloadObj.balancePayload = {
                                balanceAction: balanceOperations.CREATE_AMOUNT, 
                                amount: transactionData.amount
                            } */
                            //#endregion

                            // DON'T ACCEPT expenditure transaction for non-existent balance doc
                            if (transactionData.type == transactionType.EXPENDITURE) {
                                throw new Error(`Balance Does not exist for ${transactionData.currency}, Expenditure not possible`)
                            }

                            actionObject.balanceActionObject = {
                                type: UPDATE_BALANCE_DATA_2,
                                payload: {
                                    id: transactionData.currency,

                                    balanceOperation: balanceOperations.CREATE_AMOUNT,

                                    amount: transactionData.amount
                                }
                            }

                            return {
                                commit: true,
                                operation: 'set',
                                data: {
                                    currency: transactionData.currency,
                                    amount: transactionData.amount,
                                },
                                targetDocPath: `users/${uid}/balance/${transactionData.currency}`,
                            }
                        }
                    }
                }
            ])

            // #region DEPRECATED
            /* dispatch({
                type: UPDATE_BALANCE_DATA, 
                payload: payloadObj.balancePayload
            })
            dispatch({
                type: UPDATE_PRIMARY_TRANSACTION, 
                payload: payloadObj.transactionPayload, 
            }) */
           // #endregion

           flushSync(()=>{

                // created transaction may or may not be a primary transaction
               actionObject.transactionActionObject && dispatch(actionObject.transactionActionObject);
               dispatch(actionObject.balanceActionObject);
               extraWork && extraWork({
                id: transactionId, 
                data: transactionData
               })
           })
           

        }
        catch(e) {
            consoleError(`WHOOPSIE! Your transaction was not saved. Your data is lost lol.`);
            console.log(e);
            throw e;
        }
    }
}


export const modifyTransactionThunk = (uid, formFields, modifiedFields, extraWork)=>{

    // action types extraction
    const {INITIALIZE_BALANCE, UPDATE_BALANCE_DATA_2} = UPDATE_BALANCE; 
    const {UPDATE_PRIMARY_TRANSACTION, REMOVE_PRIMARY_TRANSACTION} = UDPATE_PRIMARY_TRANSACTIONS;

    const now = dayjs().valueOf();
    
    return async function thunkFunction(dispatch, getState) {

        const getTransactionId = ()=> formFields.id
        const getModifiedData = ()=>{
            
            const modifiedData = {};
            modifiedData.timestamp = {
                modifiedAt: now
            }

            for (let key in modifiedFields) {
                
                if (key == 'occurredAt') {
                    modifiedData.timestamp.occurredAt = formFields.occurredAt;
                }
                else {
                    modifiedData[key] = formFields[key]
                }
            }

            return modifiedData;

        }
        const getTransactionData = ()=>{
            const transactionData = { ...formFields };
            delete transactionData['occurredAt'];

            transactionData.timestamp = {
                createdAt: now, 
                modifiedAt: now, 
                occurredAt: formFields.occurredAt
            }
            return transactionData;
        }
        

        const modifiedData = getModifiedData(); 
        const transactionId = getTransactionId();
        const transactionData = getTransactionData();

        const previous_currency = modifiedFields.currency || transactionData.currency;
        const new_currency = transactionData.currency;

        const actionObject = {
            transactionActionObject : null, 
            balanceActionObjectList: [], 
        }

        /* ------------ RUNNING FIRESTORE TRANSACTION --------- */
        // #region ATTENTION
        /* 
        FIXME:
        prev-currency-balance & new-currency-balance
        need to be modified in application state 
        --> UPDATE_BALANCE_DATA, should take an array as payload
        --> payload: [ {balanceAction, amount, id}, {balanceAction, amount, id}]

        - each firestore-transaction-creator-object is designed to target just one document
        - we need the payload array made in payloadObj.balanceData
        - if currency is changed, we will need
        - FS-transaction-creator-object for prev-curr-balance
        - FS-transaction-creator-object for new-curr-balance

        We will have to split initializing the payloadObj.balanceData 
        accross these 2 FS-transaction-creator-objects
        */
       //#endregion

        try { 

            // to hold intermediate state of targetDocs
            const pendingUpdates = {};

            const updateBalance = Boolean(modifiedFields.currency) ||
                Boolean(modifiedFields.amount) ||
                Boolean(modifiedFields.type);

            await new FirestoreCRUD().firestoreTransaction([

                /* ----------- financial-transaction -------- */
                {
                    docPathDependencies: [`users/${uid}/transactions/${transactionId}`], 
                    
                    transactionConditionFunction(docSnapDependencies) {

                        /* ----------- transaction already exists ------------ */

                        // if transaction is modified -> out of the current year-duration 
                        // transaction is no longer a valid primary transaction
                        if ( !DayJSUtils.isWithinTimeframe( defaults.primaryTransactionsTimeframe, 
                            transactionData.timestamp.occurredAt, 0 )) {

                                consoleDebug(`${transactionData.title} -- no longer Primary Transaction`);
                                
                                actionObject.transactionActionObject = {

                                    type: REMOVE_PRIMARY_TRANSACTION, 
                                    payload: {
                                        id: transactionId
                                    }
                                }

                        }
                        else {

                            actionObject.transactionActionObject = {
                                type: UPDATE_PRIMARY_TRANSACTION, 
                                payload: {
                                    id: transactionId, 
                                    modifiedData: modifiedData                                
                                }
                            }
                        }

                        return {
                            commit: true, 
                            operation: 'set', 
                            option: {merge: true}, 
                            data: modifiedData, 
                            targetDocPath: `users/${uid}/transactions/${transactionId}`
                        }
                    }
                },

                /* ------------------------- updating balance --------------------- */
                
                ...(updateBalance ? 
                    [
                        /* -------------- prev currency balance ------------ */
                        {
                            docPathDependencies: [
                                `users/${uid}/balance/${previous_currency}`, 
                                `users/${uid}/transactions/${transactionId}`
                            ], 

                            transactionConditionFunction(docSnapDependencies) {

                                const [
                                    balanceDocSnap, 
                                    transactionDocSnap
                                ] = docSnapDependencies;

                                // prev currency balance exists already.
                                const balanceDocData = balanceDocSnap.data();
                                const transactionDocData = transactionDocSnap.data();
                                
                                // #region ESSENTIAL VARIABLES
                                const balance_prevAmount = balanceDocData.amount;
                                const transaction_prevAmount = transactionDocData.amount;                                 
                                const transaction_prevType = transactionDocData.type;
                                // #endregion
                                
                                const balance_newAmount = transaction_prevType == transactionType.INCOME ?
                                    balance_prevAmount - transaction_prevAmount :
                                    balance_prevAmount + transaction_prevAmount;
                                
                                const targetDocPath = `users/${uid}/balance/${previous_currency}`
                                const operationManifest = {
                                    commit: true, 
                                    operation: 'update', 
                                    data: {amount: balance_newAmount},                                     
                                }

                                // update the --- pendingUpdates ---
                                pendingUpdates[targetDocPath] = operationManifest;

                                // [APPLICATION STATE] ----- remove contribution of transaction_prevAmount ---
                                actionObject.balanceActionObjectList.push({
                                    type: UPDATE_BALANCE_DATA_2, 
                                    payload: {
                                        balanceOperation: transaction_prevType == transactionType.INCOME ?
                                            balanceOperations.SUBTRACT_AMOUNT : balanceOperations.ADD_AMOUNT, 
                                        
                                        id: previous_currency, 
                                        amount: transaction_prevAmount,
                                    }
                                })

                                // return the writeManifest
                                return {
                                    ...operationManifest, 
                                    targetDocPath: targetDocPath
                                }
                                
                            }
                        }, 

                        /* -------------- new currency balance ------------- */
                        {
                            docPathDependencies: [
                                `users/${uid}/balance/${new_currency}`
                            ], 

                            transactionConditionFunction(docSnapDependencies) {

                                const [balanceDocSnap] = docSnapDependencies;

                                // ----- balance doc snap EXISTS ----- 
                                if (balanceDocSnap.exists() ) {

                                    const balanceDocData = balanceDocSnap.data();
                                    const balanceDocPath = balanceDocSnap.ref.path;

                                    // #region ESSENTIAL VARIABLES
                                    // if there is a pending update to the amount of this balance doc
                                    const balance_prevAmount = pendingUpdates[balanceDocPath]?.data?.amount || balanceDocData.amount;                                    
                                    const transaction_newAmount = transactionData.amount; 
                                    const transaction_newType = transactionData.type;
                                    // #endregion

                                    const balance_newAmount = transaction_newType == transactionType.INCOME ?
                                        balance_prevAmount + transaction_newAmount :
                                        balance_prevAmount - transaction_newAmount
                                    ;

                                    const targetDocPath = balanceDocPath; 
                                    const operationManifest = {
                                        commit: true, 
                                        operation: 'update', 
                                        data: {amount: balance_newAmount}, 
                                    }

                                    pendingUpdates[targetDocPath] = operationManifest;

                                    // [APP STATE] ---- include contribution of the transaction_newAmount
                                    actionObject.balanceActionObjectList.push({
                                        type: UPDATE_BALANCE_DATA_2, 
                                        
                                        payload: {
                                            balanceOperation: transaction_newType == transactionType.INCOME ?
                                                balanceOperations.ADD_AMOUNT : balanceOperations.SUBTRACT_AMOUNT,
                                            
                                            id: new_currency, 
                                            amount: transaction_newAmount
                                        }
                                    })

                                    return {
                                        ...operationManifest, 
                                        targetDocPath: targetDocPath,
                                    }
                                }
                                /* ------- balance doc snap DOES NOT EXIST ---- */
                                else {

                                    // creation of new doc in balance sub-C with transaction_newAmount
                                    // error if transaction type is EXPENDITURE --> can't deduct from 0

                                    const transaction_newType = transactionData.type;
                                    const transaction_newAmount = transactionData.amount; 
                                    // const balance_prevAmount = 0

                                    if (transaction_newType == transactionType.EXPENDITURE) {
                                        throw new BalanceError(`Balance not available for ${new_currency} Expenditure Transaction`);
                                    }

                                    const targetDocPath = balanceDocSnap.ref.path;
                                    const operationManifest = {
                                        commit: true, 
                                        operation: 'set', 
                                        data: {
                                            currency: new_currency, 
                                            amount: transaction_newAmount
                                        }
                                    }

                                    pendingUpdates[targetDocPath] = operationManifest;

                                    // [APP STATE] --- create balance object from transaction_newAmount
                                    actionObject.balanceActionObjectList.push({
                                        type: UPDATE_BALANCE_DATA_2, 
                                        payload: {
                                            balanceOperation: balanceOperations.CREATE_AMOUNT, 
                                            id: new_currency, 
                                            amount: transaction_newAmount
                                        }
                                    })

                                    return {
                                        ...operationManifest, 
                                        targetDocPath: targetDocPath
                                    }
                                }
                            }
                        }
                    ] :
                    []
                )
            ])

            flushSync(()=>{

                for (let balanceActionObejct of actionObject.balanceActionObjectList) {                
                    dispatch(balanceActionObejct);
                }
    
                dispatch(actionObject.transactionActionObject);

                extraWork && extraWork({
                    id: transactionId, 
                    data: transactionData, 
                    modifiedFields: modifiedFields
                })
            })

        }
        catch(e) {
            consoleError(e.message)
            throw e;            
        }
    }
}


export const deleteTransactionThunk = (uid, transactionObj, extraWork)=>{

    const { REMOVE_PRIMARY_TRANSACTION } = UDPATE_PRIMARY_TRANSACTIONS;
    const { UPDATE_BALANCE_DATA_2 } = UPDATE_BALANCE;

    return async function thunkFunction(dispatch, getState) {

        const { id: transactionId, data: transactionData} = transactionObj;   
        
        const actionObject = {
            transactionActionObject: null, 
            balanceActionObject: null
        }
    
        try {

            await new FirestoreCRUD().firestoreTransaction([

                {
                    docPathDependencies: [`users/${uid}/transactions/${transactionId}`], 
                    
                    transactionConditionFunction(docSnapDependencies) {

                        const [transactionDocSnap] = docSnapDependencies;

                        // if transaction was part of primary_transactions --- REMOVE
                        if (DayJSUtils.isWithinTimeframe(defaults.primaryTransactionsTimeframe, 
                            transactionData.timestamp.occurredAt, 0) ) {

                                actionObject.transactionActionObject = {
                                    type: REMOVE_PRIMARY_TRANSACTION, 
                                    payload: {id: transactionId}
                                }
                        }

                        return {
                            commit: true, 
                            operation: 'delete', 
                            targetDocPath: transactionDocSnap.ref.path,
                        }
                    }
                }, 

                {
                    docPathDependencies: [`users/${uid}/balance/${transactionData.currency}`], 

                    transactionConditionFunction(docSnapDependencies) {

                        const [balanceDocSnap] = docSnapDependencies;

                        const balanceData = balanceDocSnap.data();

                        /* ---- the transaction has to be deleted ----- */
                        // remove its existing influence
                        
                        // #region ESSENTIAL VARIABLES
                        const currentBalanceAmount = balanceData.amount;
                        const newBalanceAmount = transactionData.type == transactionType.INCOME ?
                            currentBalanceAmount - transactionData.amount :
                            currentBalanceAmount + transactionData.amount ;
                        // #endregion

                        
                        actionObject.balanceActionObject = {
                            type: UPDATE_BALANCE_DATA_2, 
                            payload: {

                                balanceOperation: transactionData.type == transactionType.INCOME ?
                                    balanceOperations.SUBTRACT_AMOUNT : balanceOperations.ADD_AMOUNT, 

                                id: transactionData.currency, 
                                amount: transactionData.amount
                            }
                        }

                        return {
                            commit: true, 
                            operation: 'update', 
                            data: {amount: newBalanceAmount}, 
                            targetDocPath: balanceDocSnap.ref.path
                        }

                    }
                }
            ])

            flushSync(()=>{

                actionObject.transactionActionObject && dispatch(actionObject.transactionActionObject);

                dispatch(actionObject.balanceActionObject);

                extraWork && extraWork({
                    id: transactionId, 
                    data: transactionData
                })

            })
        }
        catch(e) {
            consoleError(e);
            console.log(e);
            throw e;
        }
    }

}