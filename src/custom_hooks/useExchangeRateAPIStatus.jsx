import { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";
import ExchangeRateAPI from "../exchangeRate_api";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe as timeframeEnum, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";
import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";


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