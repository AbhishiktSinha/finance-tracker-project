import { useRef, useMemo, useContext } from "react";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";

/**## useDynamicAmount
 * Hook that gives a dynamic amount value to be consumed in dashboard transaction cards  
 * This amount value is responsive to changes in: 
 * - initializer
 * - newTransactionData
 * - defaultCurrency
 * 
 * 
 * @param {Array<object>} initializer List of transaction objects
 * @param {string} defaultCurrencyCode INR | USD | EUR etc
 * @param {object} newTransaction transaction object
 * @param {string} cardTransactionType 'income' | 'expenditure' | undefined
 * @returns {status, data, error} amount.current
 */
export default function useDynamicAmount(initializer, defaultCurrencyCode, newTransactionData, cardTransactionType, activeTimeframe) {

    // re-render on status change
    // const status = useExchangeRateAPIStatus(defaultCurrencyCode);
    const {exchangeRateStatus: status} = useContext(exchangeRateStatusContext)
    
    // don't need a stateful variable,
    // this hook runs as a consequence of render of parent, it does not trigger re-render on its own    
    // it calculates the required data for every render
    const amount = useRef({
        'status': status,
        data: undefined,
        error: ''
    })
    
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
        consequently changing the initializer without changing newTransactionData */
    
    // INITIALIZES: ---> AMOUNT.DATA
    useMemo(()=>{
        if (amount.current.status == asyncStatus.SUCCESS) {
            
            amount.current.data = new ExchangeRateConvertor().
                reduceConvertedList(defaultCurrencyCode, initializer)
        }
    }, [defaultCurrencyCode, status, activeTimeframe])

    /* update amount with every distinct newTransactionData
    newTransactionData is already provided according to the card type
    for income card only new income transactions within the timeframe are provided
    for balance card all newly created transactions are provided */
    // UPDATES ----> AMOUNT.DATA, with every distinct newTransaction 
    useMemo(() => {
        // handle initial case
        if (Boolean(newTransactionData)) {

            const transactionValue = new ExchangeRateConvertor().
                convertAmount(defaultCurrencyCode, newTransactionData);

            const { type } = newTransactionData;
            
            // for income & expenditure cards
            // newTransactionData is of the specific type
            // increase income or expenditure amount
            if (Boolean(cardTransactionType)) { 
                amount.current.data += transactionValue;
            }
            // for balance card, no cardTransactionType is provided
            else { 
                if (type == transactionType.INCOME) { amount.current.data += transactionValue}
                else if (type == transactionType.EXPENDITURE) { amount.current.data -= transactionValue }
            }
        }

    }, [newTransactionData])


    return amount.current;
}