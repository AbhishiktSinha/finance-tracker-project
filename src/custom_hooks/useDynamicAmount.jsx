import { useRef, useMemo, useContext } from "react";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, transactionOperations, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";
import { DayJSUtils } from "../dayjs";
import latestTransactionContext from "../features/PrivateLayout/pages/Dashboard/context/LatestTransactionContext";

/**## useDynamicAmount
 * Hook that gives a dynamic amount value to be consumed in dashboard transaction cards  
 * This amount value is responsive to changes in: 
 * - initializer
 * - latestTransaction
 * - defaultCurrency
 * 
 * 
 * @param {Array<object>} initializer List of transaction objects
 * @param {string} defaultCurrencyCode INR | USD | EUR etc
 * @param {object} newTransaction transaction object
 * @param {string} cardTransactionType 'income' | 'expenditure' | undefined
 * @returns {status, data, error} amount.current
 */
export default function useDynamicAmount(initializer, defaultCurrencyCode, cardTransactionType, activeTimeframe) {

    // re-render on status change
    // const status = useExchangeRateAPIStatus(defaultCurrencyCode);
    const {exchangeRateStatus: status} = useContext(exchangeRateStatusContext)
    const {selectLatestTransaction, getNewAmount} = useContext(latestTransactionContext)
    
    const latestTransaction = selectLatestTransaction(cardTransactionType, activeTimeframe, 0);
    
    // don't need a stateful variable,
    // this hook runs as a consequence of render of parent, it does not trigger re-render on its own    
    // it calculates the required data for every render
    const amount = useRef({
        'status': status,
        data: undefined,
        error: ''
    })
    
    
    // #region DEBUG-LOGS
    consoleDebug(`Latest >> ${cardTransactionType} << Transaction for CURRENT >> ${activeTimeframe} << -----${status} || ${amount.current.data} `);
    console.log(latestTransaction);
    // #endregion
    
    /* ------------- UPDATING DATA DURING RENDER --------- */
    
    // UPDATES --> STATUS
    useMemo(()=>{
        amount.current.status = status;
    }, [status])
    
    consoleDebug(`Status in useDynamicAmount: ${status}\n
        Status sent to ${cardTransactionType ? 
            (cardTransactionType==transactionType.INCOME?'Income':'Expenditure') :
             'Balance'}: ${amount.current.status}`);

    
    /* recompute amount on every defaultCurrencyCode change for success
        recompute also when the activeTimeframe changes, 
        consequently changing the initializer without changing latestTransaction */
    
    // INITIALIZES: ---> AMOUNT.DATA
    useMemo(()=>{
        if (amount.current.status == asyncStatus.SUCCESS) {
            
            amount.current.data = new ExchangeRateConvertor().
                reduceConvertedList(defaultCurrencyCode, initializer)
        }
    }, [defaultCurrencyCode, status, activeTimeframe])

    /* update amount with every distinct latestTransaction
    ATTENTION: latestTransaction is already NOT provided according to the card type
    */
    // UPDATES ----> AMOUNT.DATA, with every distinct newTransaction 
    useMemo(() => {
        // handle initial case
        if (Boolean(latestTransaction)) {

            const {id: transactionId, transactionOperation: operation, 
                transactionData, modifiedFields
            } = latestTransaction;

            const newAmount = getNewAmount(amount.current.data, defaultCurrencyCode, 
                cardTransactionType, activeTimeframe, 0, latestTransaction);
            
            amount.current.data = newAmount;
        }

    }, [latestTransaction])


    return amount.current;
}