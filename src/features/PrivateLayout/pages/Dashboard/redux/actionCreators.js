import { UDPATE } from "./actions";

const { 
    ADD_DASHBOARD_TRANSACTION,
    TOGGLE_TIMEFRAME,
 } = UDPATE;

/**
 * 
 * @param {object} payload provide paylaod as { transactionId: trnsactionObject } 
 * @returns {object} action object
 */
export const addDashboardTransaction = (payload)=>{
    return {
        type: ADD_DASHBOARD_TRANSACTION,
        payload: payload,
    }
}
export const toggleTimeframe = ()=>{
    return {
        type: TOGGLE_TIMEFRAME,
    }
}