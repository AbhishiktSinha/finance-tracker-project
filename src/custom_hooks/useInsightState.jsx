import { useState, useEffect, useCallback, useContext, useMemo } from "react";

import {consoleDebug, consoleInfo, consoleSucess } from "../console_styles";

import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe as timeframeEnum, transactionType } from "../enums";

import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";
import { useSelector } from "react-redux";
import { fetchPreviousTimeframeTransactionsData } from "../features/PrivateLayout/utils";
import userAuthContext from "../features/PrivateLayout/context/userAuthContext";


// FIXME: make this hook responsive to newTransaction
/* FIXME: 
    This hook currently handles conditions of toggling the timeframe  
    and fetching appropriate data from backend or providing the available data

    But the insight data is not yet responsive to new transactions
*/

/* If newTransaction lies in the previous occurrence of activeTimeframe, then insight data must change right?
*/
/* WARNING 
    Can't have newTransaction as a prop, because Income & Expenditure cards use a filtered selector
    to select newTransaction.         
*/
/* FIXME:
    If a new transaction falls outside of the activeTimeframe, the DashboardTransaction cards select undefined as newTransaction
    This prevents our insight from re-computing 
*/
/* TODO: 
    A direct dependency on newTransaction using useSelector should solve this?
*/

/**## Custom Hook: useInsightState
 * Hook that provides stateful insight data, for the previous WEEK/MONTH/YEAR
 * ### Returned Value
 * Object with the following fields: 
 * - {string} status: 'loading' | 'init' | 'success' | 'error'
 * - {object} data : { currency, amount }
 * - {string} error: ----
 * 
 * **Note**: Returned { data } is relative for *balance card*
 * 
 * @param {string} uid 
 * @param {string} activeTimeframe 
 * @param {string} type 
 * @param {string} defaultCurrencyCode 
 * @returns Object with necessary insight information
 */
export default function useInsightState(activeTimeframe, defaultCurrencyCode, newTransactionData, type) {

    /**Function that creates an object with the timeframes as the keys  
     * and the provided value as the default value for all the keys.  
     * 
     * @param {any} value any value to initialize all the timeframe keys with
     * @returns {object} an object with timeframe keys all initialized with the given value
     */
    const initializeTimeframes = useCallback((value)=>{
        
        const obj = {};

        for (const timeframe in timeframeEnum) {

            obj[timeframeEnum[timeframe]] = value;
        }

        return obj;

    }, [])

    /** State Initializer Function
     */ 
    const initializerFunction = useCallback(()=>{
        return {
            status: initializeTimeframes(asyncStatus.INITIAL), 
        
            data: initializeTimeframes(undefined),
        
            error: initializeTimeframes(''),
        }
    }, [])

    const [state, setState] = useState( initializerFunction )    
    const {user: {uid}} = useContext(userAuthContext);

    console.log('STATE SET IN',type,'useInsightState:\n', state);  

    /**Utility function to change the status for the given timeframe 
     * 
     * @param {string} payload new status, select from `asyncStatus` enum
     * @param {string} timeframe target timeframe, defaults to `activeTimeframe`
    */
    const setStatus = useCallback( (payload, timeframe = activeTimeframe)=>{
        setState(state=>{
            return {
                ...state, 
                status: {
                    ...state.status, 
                    [timeframe]: payload
                }
            }
        })
    }, [])
 
    /**Utility function to set the data for the given timeframe
     * 
     * @param {object} payload payload must be an obejct in this format: {currency, amount}
     * @param {string} timeframe target timeframe, defaults to `activeTimeframe`
     */
    const setData = useCallback( (payload, timeframe=activeTimeframe)=>{

        setState(state=>{
            return {
                ...state, 
                data: {
                    ...state.data, 
                    [timeframe]: payload
                }
            }
        })
    }, [])
    
    /**utility function to set the error for the given timeframe 
     * 
     * @param {string} payload error message string
     * @param {string} timeframe target timeframe, defaults to `activeTimeframe`
    */
    const setError = useCallback( (payload, timeframe = activeTimeframe) => {
        setState( state => {
            return {
                ...state, 
                error: {
                    ...state.error, 
                    [timeframe]: payload
                }
            }
        })
    })


    /* ---------------- Effect to fetch data on timeframe toggle ----------- */
    useEffect(()=>{

        (async ()=>{

            consoleDebug(`insightHook Effect ----> activeTimeframe [initial] | initial`)

            // abort api call if status is not INITIAL
            if (state.status[activeTimeframe] != asyncStatus.INITIAL) {
                return;
            }

            setStatus(asyncStatus.LOADING);

            const {
                success, 
                data: transactionList, 
                error} = await fetchPreviousTimeframeTransactionsData(uid,activeTimeframe,type);

            if (success) {

                consoleSucess(`^^^^^^^^^^ Fetched ${type} Pevious Timeframe Transactions for Insights ^^^^^^^^^^^`);                
                
                setStatus(asyncStatus.SUCCESS)
                
                const reducedConvertedAmount = new ExchangeRateConvertor().
                    reduceConvertedList(
                        defaultCurrencyCode, 
                        transactionList, 
                        type == transactionType.ALL ? true : false
                    );
                
                // set data in this format for insight data
                setData({
                    currency: defaultCurrencyCode, 
                    amount: reducedConvertedAmount
                })
            }
            else {
                setStatus(asyncStatus.ERROR)
                setError(error);
            }


        })()

    }, [activeTimeframe])

    /* ------------------ DEFAULT CURRENCY CHANGE EFFECT --------------- */
    useEffect(()=>{
        consoleDebug(`insightHook Effect ----> defaultCurrency | initial`)

        // convert the existing data into the new default currency
        for (const timeframe in state.status) {

            // if data exists
            if (state.status[timeframe] == asyncStatus.SUCCESS) {
                
                // get the new amount value for the existing data of this timeframe
                const new_reducedConvertedAmount = new ExchangeRateConvertor().
                    convertAmount(
                        defaultCurrencyCode, 
                        state.data[timeframe]
                    )
                
                setData(
                    {
                        currency: defaultCurrencyCode, 
                        amount: new_reducedConvertedAmount, 
                    }, 
                    timeframe
                )
                            
            }
        }

    }, [defaultCurrencyCode])

    /* -------------------- NEW TRANSACTION RESPONSIVENESS ------------------ */
    useEffect(()=>{

        consoleDebug(`insightHook Effect ----> newTransaction | initial`)
        
        if (! Boolean(newTransactionData)) {
            return;
        }
        consoleDebug('Insight newTransaction Change')
        
        /* If the newTransactionData lies in the previous WEEK/MONTH/YEAR,  
            udpate the data for those timeframes
        */

        const newTransactionAmt = new ExchangeRateConvertor().
            convertAmount(
                defaultCurrencyCode, 
                newTransactionData
            )
        
        const { timestamp: { occurredAt }  } = newTransactionData;
        
        /* Find all timeframes with status SUCCESS 
            Check if newTransactionData lies in the timeframe
            Update data corresponding to said timeframe if so, if not ignore
        */
        for (const timeframe in state.status) {

            // if data is present
            if (state.status[timeframe] == asyncStatus.SUCCESS) {

                // if newTransactionData lies within said timeframe
                if (DayJSUtils.isWithinTimeframe(timeframe, occurredAt, -1)) {

                    // update data at corresponding timeframe with newTransactionAmt
                    setState(state => {
                        return {
                            ...state, 

                            data: {
                                // fields: week, month, year
                                ...state.data, 

                                [timeframe]: { 
                                    // fields: currency, amount
                                    ...state.data[timeframe], 

                                    amount: state.data[timeframe].amount + newTransactionAmt

                                }
                            }
                        }
                    })
                }
            }
        }

    },[newTransactionData])


    return {
        status: state.status[activeTimeframe],
        data: state.data[activeTimeframe], 
        error: state.error[activeTimeframe]
    }
}