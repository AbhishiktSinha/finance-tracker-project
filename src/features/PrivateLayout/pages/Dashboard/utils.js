import { consoleError, consoleInfo } from "../../../../console_styles";
import endpoints from "../../../../network/endpoints";
import request from "../../../../network/request";

/**
 * Update the value of exchange rate in localStorage
 * 
 * Runs once per day, as per api constraints
 * 
 * aborts if current time (unix) is less than next_update_time
 * 
 */
export const updateExchangeRate = async (defaultCurrency)=>{
    
    const apiKey = import.meta.env.VITE_EXCHANGERATE_API_KEY;
    const httpConfig = {
        method: 'GET',
        url: `${endpoints.baseUrl_exchangeRate}/${apiKey}/latest/${defaultCurrency}`
    }

    const {success, data, error} = await request(httpConfig);
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
    }
    else {
        console.log(error)
    }
    
}

export const convertToDefaultCurrency = (defaultCurrency, balanceObject) => {
    
    const exchangeRate = JSON.parse(localStorage.getItem('exchangeRate')).conversion_rates;

    const conversionFactor = exchangeRate[defaultCurrency];
    
    const convert = (value, fromCurrency)=>{

        const modified_exchangeRate = exchangeRate[fromCurrency] / conversionFactor;
        return (Number(value)/modified_exchangeRate);
    }

    const initialValue = 0;
    const balance = Object.keys(balanceObject).reduce(
        (accumulator, currentValue)=>{
            
            return accumulator + (convert( balanceObject[currentValue], currentValue ))
        }, 
        initialValue)

    return balance;
}