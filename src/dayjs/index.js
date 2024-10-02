import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';


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
        return this.now.startOf(timeframe.toLowerCase())
    }

    /**
     * 
     * @param {string} timeframe 
     * @returns {Number} Timestamp representing requested day
     */
    getLastDayTimestamp(timeframe) {
        return this.now.endOf(timeframe.toLowerCase());
    }

    isWithinTimeframe(timeframe, timestamp) {
        return (timestamp >= this.getFirstDayTimestamp(timeframe) &&
            timestamp <= this.getLastDayTimestamp(timeframe));
    }

}