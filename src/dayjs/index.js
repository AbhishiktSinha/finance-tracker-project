import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { consoleDebug, consoleInfo } from '../console_styles';

import { timeframe as timeframeEnum } from '../enums';


/**
 * Uses the `login_timestamp` as a frame of reference **(now)** for any computations
 */
export class DayJSUtils {

    static #login_timestamp; //also works as now

    static getCurrentISOWeek() {
        return dayjs(this.#login_timestamp).isoWeek();
    }
    static getCurrentMonth() {
        return dayjs(this.#login_timestamp).month();
    }

    getISOWeek(timestamp) {
        return dayjs(timestamp).isoWeek();
    }
    getMonth(timestamp) {
        return dayjs(timestamp).month();
    }

    static setLoginTimestamp() {
        this.#login_timestamp = dayjs().valueOf();
    }
    static getLoginTimeStamp() {
        return this.#login_timestamp;
    }

    /**
     * ## getFirstDayTimestamp
     * Function that returns the timestamp in milliseconds of the first day of the timeframe 
     * enclosing the given timestamp.  
     * By default the timestamp is the `login_timestamp`.   
     * 
     * **For example**: if the timeframe is month, this function will retrieve 
     * the first day of the month that the given timestamp lies in. If no timestamp is given then the 
     * result will be in the context of the `login_timestamp`.
     * @param {string} timeframe 'month' | 'week' | 'year'
     * @returns {Number} Timestamp representing requested day
     */
    static getFirstDayTimestamp(timeframe, timestamp = this.#login_timestamp) {


        // get the first day of the timeframe that timestamp lies in
        const firstDay = dayjs(timestamp).startOf(timeframe);

        // consoleInfo(`First day of "${timeframe}": ${firstDay}`);
        return firstDay.valueOf();
    }

    /**
     * ## getLastDayTimestamp
     * Function that returns the timestamp in milliseconds of the last day of the timeframe 
     * enclosing the given timestamp.  
     * By default the timestamp is the `login_timestamp`.   
     * 
     * **For example**: if the timeframe is month, this function will retrieve 
     * the last day of the month that the given timestamp lies in. If no timestamp is given then the 
     * result will be in the context of the login_timestamp.  
     * 
     * @param {string} timeframe 
     * @returns {Number} Timestamp representing requested day
     */
    static getLastDayTimestamp(timeframe, timestamp = this.#login_timestamp) {

        const lastDay = dayjs(timestamp).endOf(timeframe);

        // consoleInfo(`Last day of "${timeframe}" : ${lastDay}`);
        return lastDay.valueOf();
    }

    /**
     * ## isWithinTimeframe
     * Function that checks and returns whether a given instance represented by its corresponding timestamp 
     * lies within the given current timeframe or not.  
     * That is, if the given timestamp lies in the current WEEK, MONTH, YEAR etc.  
     * 
     * @param {string} timeframe 'month' | 'year' | 'week'
     * @param {number} timestamp timestamp in milliseconds
     * @returns boolean true | false
     */
    /* static isWithinTimeframe(timeframe, timestamp) {
        return (timestamp >= this.getFirstDayTimestamp(timeframe) &&
            timestamp <= this.getLastDayTimestamp(timeframe));
    }
     */

    /**## isWithinTimeframe
     * Function that checks whether the given `timestamp` 
     * lies within `x` weeks/months/years from the current week/month/year
     * 
     * @param {string} timeframe week | month | year are the only accepted values
     * @param {number} timestamp millisecond value
     * @param {number} difference integer value, defaults to 0
     */
    static isWithinTimeframe(timeframe, timestamp, difference=0) {
        
        const now = dayjs(this.getLoginTimeStamp());
        const target = dayjs(timestamp);

        if (timeframe == timeframeEnum.YEAR) {

            return (target.year() == (now.year() + difference) );
        }
        else {

            // check month or isoWeek if timestamp lies in the current year
            if (target.year() == now.year()) {

                if (timeframe == timeframeEnum.MONTH) {

                    return (target.month() == ( now.month() + difference ))
                }
                else if (timeframe == timeframeEnum.WEEK) {

                    return (target.isoWeek() == ( now.isoWeek() + difference ))
                }
            }
            else {
                return false;
            }
        }
    }

}