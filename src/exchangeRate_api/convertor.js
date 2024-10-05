import { consoleError } from "../console_styles";

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
     * @returns ReducedConvertedAmount | undefined
     * 
     * function to reduce a list of amount-structured objects to a single 
     * reduced amount value
     */
    reduceConvertedList(defaultCurrency, initializer=[]) {

        try {
            this.#priorCheck();
            
            const reducedAmount = initializer.reduce(
                (accumulator, curr)=>{
                    return accumulator+this.convertAmount(defaultCurrency, curr.data)
                }, 0)

            return reducedAmount;
        }
        catch(e) {
            consoleError(e);
        }
    }

    /**
     * 
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