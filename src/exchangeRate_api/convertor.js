import { consoleError } from "../console_styles";
import { transactionType } from "../enums";

/**
 * Class that provides the following utility functions :
 * 1. `reduceConvertedList`: Convert a single amount-structured object into the equivalent value in the provided defaultCurrency
 * 1. `convertAmount`: Reduce a list of such amount-structured objects into a single value
 */
export default class ExchangeRateConvertor {

    #priorCheck() {
        if ( ! Boolean(localStorage.getItem('exchangeRate'))) {
            throw new Error('Exchange Rate data not found in localStorage');
        }
    }

    /**
     * 
     * @param {string} defaultCurrency 
     * @param {Array<object>} initializer 
     * @param {boolean} binary_types boolean flag to accomodate both types of transactions to be reduce-converted
     * @returns ReducedConvertedAmount | undefined
     * 
     * Function to reduce a list of amount-structured objects to a single 
     * reduced amount value  
     * **Note**:  
     * This function always returns the cumulative summed up value of all the given amount-structured objects.  
     * Use this function only for amount-structured objects of the same type i.e for either income or expenditure type transacion list or balance list
     * 
     */
    reduceConvertedList(defaultCurrency, initializer=[], binary_types = false) {

        try {
            this.#priorCheck();
            
            const reducedAmount = initializer.reduce(
                (accumulator, data)=>{

                    const {currency, amount} = data;
                    
                    const convertedAmt = this.convertAmount(defaultCurrency, {'currency': currency, 'amount': amount});

                    if (! binary_types) {
                        return (accumulator + convertedAmt)
                    }
                    else {

                        const currType = curr.data.type;
                        
                        return (
                            currType == transactionType.INCOME ? 
                                accumulator + convertedAmt : 
                                accumulator - convertedAmt
                        )
                    }

                }, 0)

            return reducedAmount;
        }
        catch(e) {
            console.log(e, initializer);
            consoleError(e);
        }
    }

    /**
     * ## convertAmount  
     * Converts a single data to equivalent value in the given defaultCurrencyCode.  
     *   
     * Provided data should be an `object`, necessarily containing the following fields:  
     *- `currency`: currency of the data
     *- `amount`: amount in the respective currency
     * @param {string} defaultCurrency 
     * @param {object} amountObject object which necessarily contains the fields: `currency` and `amount`
     * @returns the amount converted to the equivalent value in the defaultCurrency | undefined
     */
    convertAmount(defaultCurrency, amountObject={}) {
        
        try {
            this.#priorCheck()

            const {currency, amount} = amountObject;

            const exchangeRate = JSON.parse(localStorage.getItem('exchangeRate'))
                .conversion_rates;

            const conversionFactor = exchangeRate[defaultCurrency];
            
            const convert = (value, fromCurrency)=>{
        
                const modified_exchangeRate = exchangeRate[fromCurrency] / conversionFactor;
                return (Number(value)/modified_exchangeRate);
            }

            return convert(amount, currency);
        }
        catch(e) {
            consoleError(e);
        }
    }
}