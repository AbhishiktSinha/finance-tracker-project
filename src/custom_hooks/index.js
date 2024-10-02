import { useState, useEffect, useCallback, useRef } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleError, consoleInfo } from "../console_styles";
import ExchangeRateAPI from "../exchangeRate_api";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, transactionType } from "../enums";
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
        initial: updateExchangeRate-> makes api call and returns promise of status
        loading: updateExchangeRate-> does not make api call, returns existing promise
        success: effect function is aborted
    */
    useEffect(()=>{

        ( async ()=>{

            if (status != asyncStatus.SUCCESS) {

                const newStatus = await ExchangeRateAPI.updateExchangeRate(defaultCurrencyCode);
                setStatus(newStatus);
            }
        } )()
    }, [])

    return status;
}


export function useDynamicAmount(initializer, defaultCurrencyCode, newTransaction, cardTransactionType) {

    // re-render on status change
    const status = useExchangeRateAPIStatus(defaultCurrencyCode);
    
    const amount = useRef({
        'status': status,
        data: undefined,
        error: ''
    })

    // recompute amount on every defaultCurrencyCode change for success
    useMemo(()=>{
        if (amount.current.status == asyncStatus.SUCCESS) {
            
            amount.current.data = new ExchangeRateConvertor().
                reduceConvertedList(defaultCurrencyCode, initializer)
        }
    }, [defaultCurrencyCode])

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
