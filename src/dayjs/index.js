import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { consoleDebug, consoleInfo } from '../console_styles';


export class DayJSUtils {

    static #login_timestamp;

    /* ATTRIBUTES:
        now: the dayjs object representing the curernt moment
                initiated at class instantiation
     */

    /**
     * 
     * @param {Number} timestamp by default take the current timestamp to create `now`
     */
    constructor(timestamp = dayjs().valueOf()) {
        this.now = dayjs(timestamp);
        consoleInfo(`DayJSUtils initialized with now: ${this.now}`)
    }

    getCurrentISOWeek() {
        return this.now.isoWeek();
    }
    getCurrentMonth() {
        return this.now.month();
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
     * Function to find the first day of the given timeframe
     * with respect to `now`
     * @param {string} timeframe 'month' | 'week' | 'year'
     * @returns {Number} Timestamp representing requested day
     */
    getFirstDayTimestamp(timeframe) {
        const firstDay = this.now.startOf(timeframe);
        consoleInfo(`First day of "${timeframe}": ${firstDay}`);
        return firstDay.valueOf();
    }

    /**
     * 
     * @param {string} timeframe 
     * @returns {Number} Timestamp representing requested day
     */
    getLastDayTimestamp(timeframe) {
        const lastDay = this.now.endOf(timeframe);
        consoleInfo(`Last day of "${timeframe}" : ${lastDay}`);
        return lastDay.valueOf();
    }

    isWithinTimeframe(timeframe, timestamp) {
        return (timestamp >= this.getFirstDayTimestamp(timeframe) &&
            timestamp <= this.getLastDayTimestamp(timeframe));
    }

}