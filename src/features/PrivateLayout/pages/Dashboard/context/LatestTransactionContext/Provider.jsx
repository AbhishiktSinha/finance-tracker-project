import latestTransactionContext from ".";
import { useState } from "react";
import { transactionOperations, transactionType } from "../../../../../../enums";
import { DayJSUtils } from "../../../../../../dayjs";
import ExchangeRateConvertor from "../../../../../../exchangeRate_api/convertor";

export default function LatestTransactionContextProvider({children}) {

    const [latestTransaction, setLatestTransaction] = useState();
    /* LOOKS LIKE:  
        {
            id: ___, 
            transactionOperation: CREATION, MODIFICATION, DELETION, 
            transactionData: {}, 
            modifiedFields: {}
        }
    */
    const getPreviousValue = (field) => {
        const { modifiedFields, transactionData } = latestTransaction;
        if (field == 'occurredAt') {
            return modifiedFields[field] ? modifiedFields[field] : transactionData.timestamp[field]
        }
        return modifiedFields[field] ? modifiedFields[field] : transactionData[field];
    }
    const getCurrentValue = (field) => {

        if (field == 'occurredAt') {
            return latestTransaction.transactionData.timestamp.occurredAt;
        }
        else {
            return latestTransaction.transactionData[field];
        }
    }

    const selectLatestTransaction = (type, timeframe, timeframeDifference)=>{

        if (!latestTransaction) return undefined;

        /* ----- balance card be needin all dose transactions ---- */
        if (type == transactionType.ALL) return latestTransaction;

        const { modifiedFields, transactionData, transactionOperation } = latestTransaction;


        if (transactionOperation == transactionOperations.CREATION || 
            transactionOperation == transactionOperations.DELETION ) {

            return (
                (transactionData.type == type &&
                    DayJSUtils.isWithinTimeframe(timeframe, transactionData.timestamp.occurredAt, timeframeDifference)) ?
                    latestTransaction :
                    undefined
            )
        }
        else if (transactionOperation == transactionOperations.MODIFICATION) {
            
            // if transaction used to belong, or it belongs now
            if ((
                getCurrentValue('type') == type && 
                DayJSUtils.isWithinTimeframe(timeframe, getCurrentValue('occurredAt'), timeframeDifference)
            ) || (
                    getPreviousValue('type') == type &&
                    DayJSUtils.isWithinTimeframe(timeframe, getPreviousValue('occurredAt'), timeframeDifference)
                )
            ) {
                return latestTransaction
            }
            else {
                return undefined;
            }
        }
    }

    const getNewAmount  = (oldAmount, defaultCurrencyCode, type, timeframe, timeframeDifference, latestTransaction)=> {

        // BASE CASE ---- null check
        if (latestTransaction == undefined) { return oldAmount };
        

        // CREATION-CASE ---> every consumer provides latest transaction filtered according to type
        if (latestTransaction.transactionOperation == transactionOperations.CREATION) {

            const convTransactionAmount = new ExchangeRateConvertor().convertAmount(
                defaultCurrencyCode, latestTransaction.transactionData)

            // balance case 
            if (type == transactionType.ALL) {
                
                return (
                    latestTransaction.transactionData.type == transactionType.INCOME ? 
                        oldAmount + convTransactionAmount : 
                        oldAmount - convTransactionAmount 
                );
            }
            // selective case 
            else {
                return oldAmount + convTransactionAmount;
            }
        }
        // MODIFICATION CASE
        else if (latestTransaction.transactionOperation == transactionOperations.MODIFICATION ) {

            // if none of the amount-related fields have been modified
            const { modifiedFields } = latestTransaction;
            if (!modifiedFields.occurredAt && !modifiedFields.type && !modifiedFields.currency && !modifiedFields.amount) return oldAmount;

            const prevConvTransactionAmount = new ExchangeRateConvertor().convertAmount(
                defaultCurrencyCode, {
                    currency: getPreviousValue('currency'), 
                    amount: getPreviousValue('amount'),
                }
            ); 

            const newConvTransactionAmount = new ExchangeRateConvertor().convertAmount(
                defaultCurrencyCode, 
                {
                    currency: getCurrentValue('currency'), 
                    amount: getCurrentValue('amount')
                }
            )

            // modificaiton --- balance case --- timeframe does not matter
            if (type == transactionType.ALL) {

                return (
                    getPreviousValue('type') == transactionType.INCOME ?
                        oldAmount - prevConvTransactionAmount + (
                            getCurrentValue('type') == transactionType.INCOME ?
                                newConvTransactionAmount :
                                (-newConvTransactionAmount)
                        ) :
                        oldAmount + prevConvTransactionAmount + (
                            getCurrentValue('type') == transactionType.INCOME ?
                                newConvTransactionAmount :
                                (-newConvTransactionAmount)
                        )
                )
            }
            // modification --- selective case ---- timeframe matters
            else {
                
                // in situ modification 
                /* the transaction always has been a part of the bracket, 
                and modification does not make it ineligible */
                if ( getPreviousValue('type') == getCurrentValue('type') && getPreviousValue('type') == type && 
                        DayJSUtils.isWithinTimeframe(timeframe, getPreviousValue('occurredAt'), timeframeDifference) && 
                            DayJSUtils.isWithinTimeframe(timeframe, getCurrentValue('occurredAt'), timeframeDifference) ) {
                            
                    return oldAmount - prevConvTransactionAmount + newConvTransactionAmount;
                }
                // ---------------- exclude & admit case --- 
                else {

                    // exclusion --- used to belong previously
                    if ( getCurrentValue('type') != type || 
                            ! DayJSUtils.isWithinTimeframe(timeframe, getCurrentValue('occurredAt'), timeframeDifference)) {

                                return (oldAmount - prevConvTransactionAmount);
                            }
                    // admittance --- belongs to the bracket now, didn't previously
                    else if ( getPreviousValue('type') != type || !DayJSUtils.isWithinTimeframe(timeframe, getPreviousValue('occurredAt'), timeframeDifference) && 
                                getCurrentValue('type') == type && DayJSUtils.isWithinTimeframe(timeframe, getCurrentValue('occurredAt'), timeframeDifference)) {

                                    return (oldAmount + newConvTransactionAmount);
                            }
                }
            }
        }
        // -------------- DELETION CASE
        else if (latestTransaction.transactionOperation == transactionOperations.DELETION ) {

            const convTransactionAmount = new ExchangeRateConvertor().convertAmount(defaultCurrencyCode, 
                latestTransaction.transactionData);

            
            // consumer --> BALANCE -- type ALL
            if (type == transactionType.ALL) {
                
                return getCurrentValue('type') == transactionType.INCOME ?
                    oldAmount - convTransactionAmount : 
                    oldAmount + convTransactionAmount;
            }
            else {
                
                return oldAmount - convTransactionAmount;
            }
        }
    }

    return (
        <latestTransactionContext.Provider 
            value={{ setLatestTransaction, selectLatestTransaction, getNewAmount }}
        >
            {children}
        </latestTransactionContext.Provider>
    )
}