import { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleDebug, consoleError, consoleInfo } from "../console_styles";
import ExchangeRateAPI from "../exchangeRate_api";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";
import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";

/**
 * useIsLoggedIn hook that returns an array 
 * 
 * useIsLoggedIn() -> [boolean: isLoggedIn, function: logOut]
 * 
 */
export function useIsLoggedIn() {

    // state: loading | true | false
    // user: null | {...}
    const [userData, setUserData] = useState({
       status: asyncStatus.INITIAL,
       data: undefined,
       error: ''
    });


    /* Let the state subscribe to change in login status */
    useEffect(() => {

        setUserData({
            ...userData, 
            status: asyncStatus.LOADING,
        })

        const unsubscribe = onAuthStateChanged(auth, (user) => {

            consoleInfo(`onAuthStateChanged : user present : ${Boolean(user)}`);
            if (user) {
                console.log('SIGNED IN USER:', user);
                setUserData({
                    status: asyncStatus.SUCCESS,
                    data: user,
                    error: '',
                });
            }
            else {
                setUserData({
                    status: asyncStatus.ERROR, 
                    data: undefined,
                    error: 'Authentication required'
                });
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    return userData;
} 

/**
 * 
 * @param {string} defaultCurrencyCode 
 * @returns the `status` of the api call as a stateful value to trigger rerenders of calling component or hook
 */
export function useExchangeRateAPIStatus(defaultCurrencyCode) {

    const [status, setStatus] = useState( ExchangeRateAPI.api_status );

    /*EFFECT RUNS after FIRST re-render only
    status: 
        initial: make api call -> updateExchangeRate
        loading: await promise of exising api call -> getExistingAPICallPromise
        success: do nothing
        error: do nothing, let the ui handle it
    */
    useEffect(()=>{
        consoleInfo('useEffect of TransactionCard');

        ( async ()=>{

            consoleInfo('Async IIFE inside the effect');
            
            if (status == asyncStatus.INITIAL) {

                consoleDebug(`STATUS: ${status} || ATTEMPTING API CALL`)

                await ExchangeRateAPI.updateExchangeRate(defaultCurrencyCode);

                consoleDebug(`NEW api_status: ${ExchangeRateAPI.api_status}`);

                setStatus(ExchangeRateAPI.api_status);
            }
            else if(status == asyncStatus.LOADING) {
                await ExchangeRateAPI.getExistingAPICallPromise();
                
                setStatus(ExchangeRateAPI.api_status);
            }
        } )()
    }, [])

    return status;
}


export function useDynamicAmount(initializer, defaultCurrencyCode, newTransaction, cardTransactionType) {

    // re-render on status change
    // const status = useExchangeRateAPIStatus(defaultCurrencyCode);
    const {exchangeRateStatus: status} = useContext(exchangeRateStatusContext)
    
    const amount = useRef({
        'status': status,
        data: undefined,
        error: ''
    })
    
    consoleDebug(`Status in useDynamicAmount: ${status}\n
        Status sent to ${cardTransactionType ? 
            (cardTransactionType==transactionType.INCOME?'Income':'Expenditure') :
             'Balance'}: ${amount.current.status}`);
    useMemo(()=>{
        amount.current.status = status;
    }, [status])

    // recompute amount on every defaultCurrencyCode change for success
    useMemo(()=>{
        if (amount.current.status == asyncStatus.SUCCESS) {
            
            amount.current.data = new ExchangeRateConvertor().
                reduceConvertedList(defaultCurrencyCode, initializer)
        }
    }, [defaultCurrencyCode, status])

    /* update amount with every distinct newTransaction
    newTransaction is already provided according to the card type
    for income card only new income transactions within the timeframe are provided
    for balance card all newly created transactions are provided */
    useMemo(() => {
        // handle initial case
        if (Boolean(newTransaction)) {

            const transactionValue = new ExchangeRateConvertor().
                convertAmount(defaultCurrencyCode, newTransaction);

            const { data: {type} } = newTransaction;
            
            // for income & expenditure cards
            // newTransaction is of the specific type
            // increase income or expenditure amount
            if (Boolean(cardTransactionType)) { 
                amount.data += transactionValue;
            }
            // for balance card, no cardTransactionType is provided
            else { 
                if (type == transactionType.INCOME) { amount.data += transactionValue}
                else if (type == transactionType.EXPENDITURE) { amount.data -= transactionValue }
            }
        }

    }, [newTransaction])

    return amount.current;
}


export function useInsightState(uid, activeTimeframe, type, defaultCurrencyCode) {

    const initializerFunction = useCallback(()=>{
        return {
            status: {
                [timeframe.YEAR] : asyncStatus.INITIAL,
                [timeframe.MONTH] : asyncStatus.INITIAL,
                [timeframe.WEEK] : asyncStatus.INITIAL,
        
            }, 
        
            data: {
                [timeframe.YEAR]: undefined, 
                [timeframe.MONTH]: undefined, 
                [timeframe.WEEK]: undefined, 
            },
        
            error: { 
                [timeframe.YEAR]: '',
                [timeframe.MONTH]: '',
                [timeframe.WEEK]: '',
            }
        }
    }, [])

    const [state, setState] = useState( initializerFunction )

    console.log('STATE SET IN useInsightState:\n', state);  

    // function to change the status for the given timeframe
    const setStatus = useCallback( (payload)=>{
        setState(state=>{
            return {
                ...state, 
                status: {
                    ...state.status, 
                    [activeTimeframe]: payload
                }
            }
        })
    }, [])
    // utility function to set the data for the given timeframe
    const setData = useCallback( (payload)=>{

        setState(state=>{
            return {
                ...state, 
                data: {
                    ...state.data, 
                    [activeTimeframe]: payload
                }
            }
        })
    }, [])
    // utility function to set the error for the given timeframe
    const setError = useCallback(payload => {
        setState( state => {
            return {
                ...state, 
                error: {
                    ...state.error, 
                    [activeTimeframe]: payload
                }
            }
        })
    })

    useEffect(()=>{

        (async ()=>{

            if (state.status[activeTimeframe] == asyncStatus.SUCCESS) {
                return;
            }

            setStatus(asyncStatus.LOADING);

            try {
                
                // first day of the current WEEK/MONTH/YEAR
                const firstDayTimestamp = DayJSUtils.getFirstDayTimestamp(activeTimeframe);
                // day in the last MONTH/WEEK/YEAR
                const dayBeforeTimestamp = firstDayTimestamp - 1000;

                // first day of the previous MONTH/WEEK/YEAR
                const firstDayTimestamp_prev_timeframe = DayJSUtils.
                    getFirstDayTimestamp(activeTimeframe, dayBeforeTimestamp);
                
                // last day of the previous MONTH/WEEK/YEAR
                const lastDayTimestamp_prev_timeframe = DayJSUtils.
                    getLastDayTimestamp(activeTimeframe, dayBeforeTimestamp);
                

                /* ----------------- NETWORK CALL -------------------- */
                const transactionListOfType = await new FirestoreCRUD().
                    getDocsData(
                        `users/${uid}/transactions`, 
                        [
                            {
                                key: 'timestamp.occurredAt', 
                                relationship: '>=', 
                                value: firstDayTimestamp_prev_timeframe
                            }, 
                            {
                                key: 'timestamp.occurredAt', 
                                relationship: '<=',
                                value: lastDayTimestamp_prev_timeframe
                            }, 
                            {
                                key: 'type', 
                                relationship: '==', 
                                value: type
                            }
                        ]
                    )
                
                setStatus(asyncStatus.SUCCESS)
                setData(new ExchangeRateConvertor().
                    reduceConvertedList(defaultCurrencyCode, transactionListOfType))
            }
            catch(e) {
                setStatus(asyncStatus.ERROR)
                setError(e);
            }

        })()

    }, [state.status[activeTimeframe]])

    // return the insight status,data,error for the current MONTH/WEEK/YEAR
    consoleDebug(`SENDING DATA TO INCOME CARD:\N
        STATUS: ${state.status[activeTimeframe]}\n
        DATA: ${state.data[activeTimeframe]}\n
        error: ${state.error[activeTimeframe]}`)
    return {
        status: state.status[activeTimeframe],
        data: state.data[activeTimeframe], 
        error: state.error[activeTimeframe]
    }
}