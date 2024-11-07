import { useState, useEffect, useCallback } from "react";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";

import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe as timeframeEnum, transactionType } from "../enums";

import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";
import { useSelector } from "react-redux";


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
 * @param {string} uid 
 * @param {string} activeTimeframe 
 * @param {string} type 
 * @param {string} defaultCurrencyCode 
 * @returns Object with necessary insight information
 */
export default function useInsightState(uid, activeTimeframe, type, defaultCurrencyCode) {

    const initializerFunction = useCallback(()=>{
        return {
            status: {
                [timeframeEnum.YEAR] : asyncStatus.INITIAL,
                [timeframeEnum.MONTH] : asyncStatus.INITIAL,
                [timeframeEnum.WEEK] : asyncStatus.INITIAL,
        
            }, 
        
            data: {
                [timeframeEnum.YEAR]: undefined, 
                [timeframeEnum.MONTH]: undefined, 
                [timeframeEnum.WEEK]: undefined, 
            },
        
            error: { 
                [timeframeEnum.YEAR]: '',
                [timeframeEnum.MONTH]: '',
                [timeframeEnum.WEEK]: '',
            }
        }
    }, [])

    const [state, setState] = useState( initializerFunction )

    const newTransactionData = useSelector( ({newTransaction})=>{
        consoleDebug(`************************* selecting newTransactionData for ${type} ******************`)
        console.log(newTransaction.data)
        if (Boolean(newTransaction.data)) {

            return ( newTransaction.data.type == type ? 
                newTransaction.data : 
                undefined
            );
        }
    })
    console.log(newTransactionData);

    console.log('STATE SET IN useInsightState:\n', state);  

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
                

                consoleSucess(`Fetched ${type} Insights`);                
                
                setStatus(asyncStatus.SUCCESS)
                
                const reducedConvertedAmount = new ExchangeRateConvertor().
                    reduceConvertedList(defaultCurrencyCode, transactionListOfType);
                
                // set data in this format for insight data
                setData({
                    currency: defaultCurrencyCode, 
                    amount: reducedConvertedAmount
                })
            }
            catch(e) {
                setStatus(asyncStatus.ERROR)
                setError(e);
            }

        })()

    }, [state.status[activeTimeframe]])

    /* ------------------ DEFAULT CURRENCY CHANGE EFFECT --------------- */
    useEffect(()=>{

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

        consoleDebug('Insight newTransaction Change')

        if (! Boolean(newTransactionData)) {
            return;
        }
        
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



    // return the insight status,data,error for the current MONTH/WEEK/YEAR
    consoleDebug(`SENDING INSIGHT DATA TO ${type} CARD`);
    console.log('STATUS:', state.status[activeTimeframe], '\n',
        'DATA:', state.data[activeTimeframe], '\n',
        'ERROR:', state.error[activeTimeframe])


    return {
        status: state.status[activeTimeframe],
        data: state.data[activeTimeframe], 
        error: state.error[activeTimeframe]
    }
}