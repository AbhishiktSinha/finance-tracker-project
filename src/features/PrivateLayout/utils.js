import currencyToSymbolMap from 'currency-symbol-map/map';
import currencyCodes from 'currency-codes/data.js'


import { changeType, transactionType } from '../../enums';

import { DayJSUtils } from '../../dayjs';
import { FirestoreCRUD } from '../../firebase/firestore';
import getSymbolFromCurrency from 'currency-symbol-map';


export const getAllCurrencyCodeDropdownOptions = () => {
    return Object.keys(currencyToSymbolMap).map(code => {
        return {
            label: code,
            value: code
        }
    })
}

export const getCurrencySymbol = (code)=> {
    return currencyToSymbolMap[code];
}

/**
 * 
 * @param {Array<string>} statusList Array of all the `status` fields that the route depends on
 * @param {isOnboardingDone} isOnboardingDone true | false value denoting the status of onboarding
 */
export function checkDisplayUI(statusList = [], isOnboardingDone) {

    let showUI = true;
    // if any one of the dependency status is loading or initial, don't show UI
    statusList.forEach(statusItem => {

        if (statusItem == 'loading' || statusItem == 'initial') {
            showUI = false;
        }
    })

    if (isOnboardingDone != undefined) {

        if (showUI && isOnboardingDone == false) {
            showUI = false;
        }
    }

    return showUI;
}

export function getChangeType(oldValue, newValue) {

    if (oldValue < newValue) {
        return changeType.POSITIVE
    }
    else if (oldValue > newValue) {
        return changeType.NEGATIVE
    }
    else {
        return changeType.NONE;
    }
}

export function getValueChangePercentage(oldValue, newValue) {

    const change = Math.abs(newValue - oldValue);

    if (change == 0) { return 0 }
    else if (oldValue == 0) { return Infinity }
    else { return ((change / oldValue) * 100) };
}

export function range(start, endExclusive, step = 1) {
    let arr = [];
    for (let i = start; i < endExclusive; i += step) {
        arr.push(i);
    }

    return arr;
}



export async function fetchPreviousTimeframeTransactions(uid, activeTimeframe, type) {

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
                    // accomodating fetching all types of transactions
                    ...(type && type != transactionType.ALL ?
                        [{
                            key: 'type',
                            relationship: '==',
                            value: type
                        }] :
                        []
                    )
                ]
            )


        return {
            success: true,
            data: transactionListOfType,
            error: '',
        }
    }
    catch (e) {
        return {
            success: false,
            error: e
        }
    }
}



/**## flatten
 * This function takes a multi-level nested object and creates a flattened clone
 * 
 * @param {object} obj 
 * @returns flattened object clone
 */
export function flatten(obj) {

    let flat = {}; 

    for (let key in obj)  {

        if (typeof obj[key] == 'object') {

            const miniObj = flatten(obj[key]);
            flat = {...flat, ...miniObj};
        }
        else {
            flat[key] = obj[key];
        }
    }

    return flat;
}


/**
 * 
 * @returns { {code: { code: string, name: string, symbol:string>}} } fiatCurrencies
 */
export default function getAllFiatCurrencies() {

    const fiatCurrencies = {};

    currencyCodes.forEach( 
        ({code, currency}) => {

            fiatCurrencies[code] = {
                code: code, 
                name: currency, 
                symbol: getSymbolFromCurrency(code)
            }
        }
    )

    return fiatCurrencies;    
}


/**
 * 
 * @param {Array<object>} list list of identically-structured objects
 * @param {string} primary_key the primary-key for every object in the list
 * @returns 
 */
export function convertListToObject(list, primary_key) {
    const obj = {};

    list.forEach(
        (listObject)=>{

          const { [primary_key]: key, ...restObject} = listObject

          obj[key]= flatten(restObject);
        }
    )

    return obj;
}


/**
 * 
 * @param {Function} callback 
 * @param {number} delay microseconds
 * @returns 
 */
export function debounce( callback, delay ) {

    let timeout = null;

    return function debouncedCallback(...params) {

        if (timeout) {
            clearTimeout(timeout);            
        }

        timeout = setTimeout(()=>{
            timeout = null;
            callback(...params)
        }, delay)
    }
}