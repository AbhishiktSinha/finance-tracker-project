import { consoleDebug, consoleError, consoleInfo } from "../console_styles";
import ExchangeRateAPIError from "../custom_errors/ExchangeRateAPIError";
import { asyncStatus } from "../enums";
import endpoints from "../network/endpoints";
import request from "../network/request";

// DEPRECATED
export default class ExchangeRateAPI {

    static #priorCheck() {
        if (Boolean(localStorage.getItem('exchangeRate'))) {

            const time_next_update = JSON.parse(localStorage.getItem('exchangeRate'))?.time_next_update;
            const margin = 500; //ms
            const time_now = new Date().getTime();
            
            if (time_next_update && ( time_now < time_next_update - margin ) ) {
                consoleError(`API Call aborted, time_next_udpate: ${new Date(time_next_update)}`)
                return false
            }
            else {
                return true;
            }
        }
    }

    /**
     * 
     * @param {string} defaultCurrency 
     * @param {string} flag force | undefined
     * @returns Promise of the new status of the api call : success | error
     */
    static async updateExchangeRate(defaultCurrency, flag) {

        // prior check by default
        if (flag != 'force') {
            const update_required = this.#priorCheck();
            
            // abort if update is not required
            if (!update_required) {
                return
            }
        }

        /* PREPARING FOR NETWORK CALL */

        const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
        const httpConfig = {
            method: 'GET',
            url: `${endpoints.baseUrl_exchangeRate}/${apiKey}/latest/${defaultCurrency}`
        }

        /* ----------------- NETWORK CALL HERE --------------------------- */
        const { success, data, error } = await request(httpConfig)
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
            // returns without error
        }
        else {
            throw new ExchangeRateAPIError(error.message);
        }
        
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