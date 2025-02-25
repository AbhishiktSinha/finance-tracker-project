import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { consoleDebug, consoleInfo } from '../console_styles';

import { timeframe as timeframeEnum } from '../enums';


dayjs.extend(isoWeek);
/**
 * Uses the `login_timestamp` as a frame of reference **(now)** for any computations
 */
export class DayJSUtils {

    static #login_timestamp = undefined; //also works as now

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

    /**## getFirstDayTimestamp
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

    /**## getLastDayTimestamp
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

    /**DEPRECATED
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
     * lies within `x` timeframes from the corresponding timeframe of `now`  
     * 
     * i.e: if timestamp lies within the ±x <sup>th</sup> `month` from current `month`  
     * or:  if timestamp lies within the ±x th `month_duration` from the current `month_duration`
     * 
     * @param {string} timeframe week | month | year are the only accepted values
     * @param {number} timestamp millisecond value
     * @param {number} difference integer value, defaults to 0
     */
    static isWithinTimeframe(timeframe, timestamp, difference=0) {
        
        const now = dayjs(this.getLoginTimeStamp());
        const target = dayjs(timestamp);

        /* ------ standard timeframe: current year, month, week ------- */
        if ( !timeframe.endsWith('_d')) {


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

        /* ----------- rolling duration timeframes: year_d, month_d, week_d --------- */
            else if ( timeframe.endsWith('_d') ) {

                const duration = timeframe.substring(0, timeframe.indexOf('_'));
                const x = Math.abs(difference);
                
                let leftLimit, rightLimit; 
                
                if (difference < 0) {

                    rightLimit = now.subtract(x, duration).endOf('day');
                    leftLimit = now.subtract(x - 1, duration).startOf('day');
                }
                else if (difference > 0) {
                    rightLimit = now.add(x, duration).endOf('day');
                    leftLimit = now.add(x - 1, duration).startOf('day');
                }
                else {
                    rightLimit = now.endOf('day'); // now is the moment of login
                    leftLimit = now.subtract(1, duration).startOf('day');
                }

                return ( timestamp >= leftLimit.valueOf() && timestamp <= rightLimit.valueOf());

            }

    }


    /**## getValuesAfterInterval
     * Function that returns the timestamp with the given interval of difference from the given `from_timestmap`
     * 
     * @param {number} from_timestamp Value of timestamp
     * @param {{intervalType: string, intervalDuration: number}} interval Describes the gap interval
     * @param {boolean} positive whether to add or subtract
     * @returns The timeframe with the neccesrray difference
     */
    static getValueAfterInterval(from_timestamp = this.#login_timestamp, {intervalType, intervalDuration}, positive = true) {

        const from = dayjs(from_timestamp).startOf('day');

        if (positive) {
            
            return from.add(intervalDuration, intervalType).valueOf();
        }
        else {
            return from.subtract(intervalDuration, intervalType).valueOf();
        }

    }

    static format(timestamp, format_string) {
        return dayjs(timestamp).format(format_string);
    }
}