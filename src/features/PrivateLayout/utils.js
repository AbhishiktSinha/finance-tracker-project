import currencyToSymbolMap from 'currency-symbol-map/map';
import currencyCodes from 'currency-codes/data.js'


import { changeType, transactionType } from '../../enums';

import { DayJSUtils } from '../../dayjs';
import { FirestoreCRUD } from '../../firebase/firestore';
import getSymbolFromCurrency from 'currency-symbol-map';
import { primaryTransactionsTimeframe } from './defaults';
import { unparse } from 'papaparse';


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



export async function fetchPreviousTimeframeTransactionsData(uid, activeTimeframe, type) {

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
        const transactionsObject = await new FirestoreCRUD().
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

        const transactionDataList = Object.values(transactionsObject);

        return {
            success: true,
            data: transactionDataList,
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

/**
 * 
 * @param {Function} callback 
 * @param {number} delay 
 * @param {boolean} leading 
 * @returns 
 */
export function throttle(callback, delay, leading=false) {

    let timeoutId = null;

    return function throttledCallback(...args) {

        if (timeoutId) return;

        if (leading) {

            callback(...args);
            timeoutId = setTimeout(()=>{
                timeoutId = null
            }, delay)
        }
        else {
            setTimeout(()=>{
                callback(...args);
                timeoutId = null;
            }, delay);
        }
    }
}



/**
 * 
 * @param {object} object the object to search for the target value, must have unique values
 * @param {*} targetValue
 * @returns {string} key
 */
export function getKey(object, targetValue) {

    return Object.entries(object).find(
        ([key, value])=>value==targetValue
    )[0];
}



/**## isPrimaryTransaction
 * This function determines whether a transaction qualifies as a 
 * `primaryTransaction` based on the `timestamp.occurredAt` for that transaction.  
 * 
 * **Note**: This function has no access to the state, it just validates whether the transaction lies within the  
 * stipulated timeframe to a be a `primaryTransaction`.
 * 
 * @param {number} occurredAt The timestamp.occurredAt for the transaction
 * @returns {boolean} 
 */
export function isPrimaryTransaction(occurredAt) {

    return DayJSUtils.isWithinTimeframe(primaryTransactionsTimeframe, occurredAt, 0)
}



export function getNestedValue(obj={}, path='') {

    return path.split('.').reduce(
        (acc, key)=>acc?.[key], 
        obj)
}



/**
 * 
 * @param {Array<{id: string, data: object}>} transactionsList list of transactions to be downloaded
 * @param {string} filename optional -> name of the csv file that will be downloaded
 * @returns {Function} download() use this function to download the .csv
 */
export function downloadAsCsv(transactionsList, filename) {

    const structured_list = transactionsList.map(({id, data: {timestamp, ...restData}}) => {

        return {
            'id': id,
            ...restData, 
            occurredAt: timestamp.occurredAt, 
            createdAt: timestamp.createdAt, 
            modifiedAt: timestamp.modifiedAt,
        }
    })

    const csv = unparse(structured_list);

    console.log(csv);
    
    return function download() {
        
        const blob = new Blob([csv], {type: 'text/csv'}); 
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.download = filename ? 
            `${filename.replace(/\.csv$/, '')}.csv` : 
            'transaction-exports.csv';

        document.body.appendChild(link);

        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
}