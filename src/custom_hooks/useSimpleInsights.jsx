import { useCallback, useContext, useEffect, useState } from "react";
import { asyncStatus } from "../enums";
import { fetchPreviousTimeframeTransactionsData } from "../features/PrivateLayout/utils";
import userAuthContext from "../features/PrivateLayout/context/userAuthContext";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import latestTransactionContext from "../features/PrivateLayout/pages/Dashboard/context/LatestTransactionContext";
import { consoleDebug, consoleInfo } from "../console_styles";


export default function useSimpleInsights (type, activeTimeframe, defaultCurrencyCode) {

    const [state, setState] = useState({
        status: asyncStatus.INITIAL, 
        data: undefined, 
        error: '',
    });

    
    const setStatus = useCallback((value) => {

        setState(state => ({
            ...state,
            status: value
        }))
    })
    const setData = useCallback((value) => {

        setState(state => ({
            ...state,
            data: value
        }))
    })
    const setError = useCallback((value) => {

        setState(state => ({
            ...state,
            error: value
        }))
    })
    

    const { user: {uid}} = useContext(userAuthContext)
    const { selectLatestTransaction, getNewAmount } = useContext(latestTransactionContext)

    // latest transaction of type for previous W/M/Y
    const latestTransaction = selectLatestTransaction(type, activeTimeframe, -1);    
    
    /* ---- fetch data when activeTimeframe changes ------- */
    useEffect(()=>{
        
        (async ()=>{
            
            try {
                
                setStatus(asyncStatus.LOADING);

                const { success, data: transactionDataList, error } = await
                    fetchPreviousTimeframeTransactionsData(uid, activeTimeframe, type);

                if (success) {

                    consoleInfo('-------- FETCHED '+ type +' TRANSACTIONS FOR PREV '+ activeTimeframe +' -------------');
                    console.log(transactionDataList)

                    const amount = new ExchangeRateConvertor().
                    reduceConvertedList(defaultCurrencyCode, transactionDataList, false);

                    setStatus(asyncStatus.SUCCESS);
                    setData({
                        currency: defaultCurrencyCode, 
                        amount: amount,
                    })
                    
                }
                else {
                    throw error;
                }
            }
            catch(e) {
                setError(e);
            }
        })()
        
    }, [activeTimeframe])

    /* ------- convert data on defaultCurrencyChange -------- */
    useEffect(()=>{

        const newConvertedAmount = new ExchangeRateConvertor().
            convertAmount(defaultCurrencyCode, state.data)
        
        setData({
            currency: defaultCurrencyCode, 
            amount: newConvertedAmount
        })
        
    }, [defaultCurrencyCode])

    /* ------- update amount with valid latestTransactions ------ */
    useEffect(()=>{

        // base case ---> null check
        if (latestTransaction != undefined) {

            const newAmount = getNewAmount(state.data.amount, defaultCurrencyCode, 
                type, activeTimeframe, -1, latestTransaction)

            setData({
                currency: defaultCurrencyCode, 
                amount: newAmount
            });
        }

    }, [latestTransaction])


    return state;
}