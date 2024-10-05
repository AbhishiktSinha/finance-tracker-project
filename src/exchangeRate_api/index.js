import { consoleDebug, consoleError, consoleInfo } from "../console_styles";
import ExchangeRateAPIError from "../custom_errors/ExchangeRateAPIError";
import { asyncStatus } from "../enums";
import endpoints from "../network/endpoints";
import request from "../network/request";


export default class ExchangeRateAPI {

    static api_status = asyncStatus.INITIAL; // iniital | loading | success | error
    static #api_status_promise = Promise.resolve(this.api_status);

    static #priorCheck() {
        if (Boolean(localStorage.getItem('exchangeRate'))) {

            const exchangeRate = JSON.parse(localStorage.getItem('exchangeRate'));
    
            // if exchangeRate object exists and does not need updation --> throw error
            if (Boolean(exchangeRate)) {
    
                // abort if 1 day has not passed
                const margin = 500; //milliseconds
    
                const time_next_update = exchangeRate['time_next_update'];
                const time_now = new Date().getTime();
    
                consoleInfo('exchangeRate object found');
                consoleDebug(`time_next_update: ${time_next_update} || time_now: ${time_now}`)
    
                // anticipate an app reload on the same day
                // use the pre-existing exchangeRate data in localStorage
                if (time_now < time_next_update) {

                    this.api_status = asyncStatus.SUCCESS;
                    this.#api_status_promise = Promise.resolve(this.api_status);

                    console.log('exchangeRateAPI priorCheck:', this.#api_status_promise);

                    throw new ExchangeRateAPIError(`API call aborted:\n Call before next update deadline ${time_next_update}`);
    
                }
            }
            // prepare to get new data
            else {
    
                consoleInfo('exchange-rate API permitted to be called');
                return;
            }
        }
    }

    /**## updateExchangeRate()
     * This method calls the `exchangeRate API` and consequently updates the conversion rate data in the 
     * `localStorage`.   
     * The `api_status` is also updated to either **SUCCESS** or **ERROR**.  
     * Retrieve the updated `api_status` post awaiting the return of this function.  
     * 
     *  
     * > ⚠️ *Use this method only when the `api_status` is **INITIAL*** ⚠️  
     * > For state: **LOADING** retrieve the Promise of the api call in progress by invoking the 
     * `getExistingAPIPromise()` method.  
     * 
     *  **WARNING:  The method call will be aborted if the api_status is anything but INITIAL**
     * 
     * @param {string} defaultCurrency 
     * @param {string} flag to forcefully update the exchange rate data
     * @returns Promise of exchangeRate API call
     */
    static async updateExchangeRate(defaultCurrency, flag) {

        try {
            // if api_status is not valid
            if (this.api_status != asyncStatus.INITIAL) {

                throw new ExchangeRateAPIError(`API call aborted for api_status: ${this.api_status}. \n
                    To get the Promise of any existing API call, use getExistingAPICallPromise()`)
            }

            if (flag != 'force') {
                this.#priorCheck();
            }

            const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
            const httpConfig = {
                method: 'GET',
                url: `${endpoints.baseUrl_exchangeRate}/${apiKey}/latest/${defaultCurrency}`
            }

            /* ----------------- NETWORK CALL HERE --------------------------- */
            this.api_status = asyncStatus.LOADING;
            this.#api_status_promise = request(httpConfig).
                then(({ success, data, error }) => {

                    console.log(success, data, error);
                    // update localStorage on success
                    if (success) {
                        const {
                            time_last_update_utc: time_last_update,
                            time_next_update_utc: time_next_update,
                            base_code: defaultCurrency,
                            conversion_rates
                        } = data.data;

                        localStorage.setItem('exchangeRate',
                            JSON.stringify(
                                {
                                    time_last_update: new Date(time_last_update).getTime(),
                                    time_next_update: new Date(time_next_update).getTime(),
                                    defaultCurrency: defaultCurrency,
                                    conversion_rates: conversion_rates
                                }
                            )
                        )
                        return asyncStatus.SUCCESS;
                    }
                    else {
                        console.log(error)
                        return asyncStatus.ERROR;
                    }
                })


            this.api_status = await this.#api_status_promise;

        }
        catch (e) {
            if ( ! e instanceof ExchangeRateAPIError) {
                this.api_status = asyncStatus.ERROR;
                this.#api_status_promise = Promise.resolve(this.api_status);
            }
            
            consoleError(e)
        }        

    }

    /**## getExistingAPICallPromise()
     * Call to retrieve and await the promise of any existing ExchangeRate API call  
     * Use when the `api_status` is **LOADING**
     * @returns Promise of any exchangeRate API call already in progress
     */
    static getExistingAPICallPromise() {
        return this.#api_status_promise;
    }
}


/**
 * Function to check whether the localStorage holds any exchangeRate data at all
 * @returns Boolean value: true | false
 */
/* export const exchangeRatePseudoStatus = () => {
    return Boolean(localStorage.getItem('exchangeRate')) ? 'success' : 'loading'
} */

/**
 * Function to check if sufficient time has elapsed since the previous API call,   
 * to warrant calling the exchange-rate API again.
 * 
 * Throws error if API call is not possible at the current time
 * 
 * Runs the API call if next update deadline has passed
 */
/* export const exchangeRateUpdatePriorCheck = () => {
    if (Boolean(localStorage.getItem('exchangeRate'))) {

        const exchangeRate = JSON.parse(localStorage.getItem('exchangeRate'));

        // if exchangeRate object exists and does not need updation --> throw error
        if (Boolean(exchangeRate)) {

            // abort if 1 day has not passed
            const margin = 500; //milliseconds

            const time_next_update = exchangeRate['time_next_update'];
            const time_now = new Date().getTime();

            consoleInfo('exchangeRate object found');
            consoleDebug(`time_next_update: ${time_next_update} || time_now: ${time_now}`)

            if (time_now < time_next_update) {
                throw new Error(`ExchangeRate API call aborted:\n Call before next update deadline ${time_next_update}`);

            }
        }
        else {
            consoleInfo('exchange-rate API permitted to be called');
            return;
        }

    }
} */
/**
 * Update the value of exchange rate in localStorage 
 */
/* export const updateExchangeRate = async (defaultCurrency) => {

    if (exchangeRate_api_details.status == 'loading' ) {
        return exchangeRate_api_details.promise;
    }
    if (exchangeRate_api_details.status == 'success' ) {
        return exchangeRate_api_details.promise;
    }

    const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
    const httpConfig = {
        method: 'GET',
        url: `${endpoints.baseUrl_exchangeRate}/${apiKey}/latest/${defaultCurrency}`
    }

    
    exchangeRate_api_details.status = 'loading';

    exchangeRate_api_details.promise = request(httpConfig).
        then(({ success, data, error }) => {

            console.log(success, data, error);
        
            if (success) {
                const {
                    time_last_update_utc: time_last_update,
                    time_next_update_utc: time_next_update,
                    base_code: defaultCurrency,
                    conversion_rates
                } = data.data;

                localStorage.setItem('exchangeRate',
                    JSON.stringify(
                        {
                            time_last_update: new Date(time_last_update).getTime(),
                            time_next_update: new Date(time_next_update).getTime(),
                            defaultCurrency: defaultCurrency,
                            conversion_rates: conversion_rates
                        }
                    )
                )
                exchangeRate_api_details.status = 'success';
                return true;
            }
            else {
                console.log(error)
                exchangeRate_api_details.status = 'error';
                return false;
            }
        })

    return exchangeRate_api_details.promise;
} */