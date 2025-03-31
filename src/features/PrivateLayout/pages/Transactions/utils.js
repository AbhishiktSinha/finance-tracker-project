import { filter } from "lodash";
import { consoleError, consoleInfo } from "../../../../console_styles";
import { getKey, getNestedValue } from "../../utils";
import { sortOrder, timeframe, transactionType } from "../../../../enums";
import { DayJSUtils } from "../../../../dayjs";



/**
 * 
 * @param {Array<[string, object | string]>} data 
 * @param {object} filterConditions 
 * @param {{query:string, match: Array<string> | null}} searchConditions
 * 
 * @returns {Array<[string, object|string]} filteredData
 */
export function searchThroughFilterOptions(data, filterConditions, searchConditions) {
    consoleInfo('------------ FILTER - DATA -----------');

    console.log(data, filterConditions, searchConditions)

    let filtered_data = [...data];

    // TODO: write filtering code
    if (filterConditions) {}

    if (searchConditions) {
        const {query, match} = searchConditions;

        filtered_data = filtered_data.filter(
            
            ([key, value])=>{
                
                if (match) {
                    return match.reduce(
                        (aggregator, curr_match_key)=>{                            
                            
                            const curr_match_parameter = value[curr_match_key];
                            
                            if (curr_match_parameter == undefined) return false;
                            
                            return (aggregator || curr_match_parameter.toUpperCase().includes(query.toUpperCase()) )
                            
                        }, false)
                }
                else {
                    return value.toUpperCase().includes(query.toUpperCase());
                }
            }

        )        
    }

    return filtered_data;
}


/**
 * 
 * @param {Array<string>} idList 
 * @param {{id:string}} data 
 * @param {{type:Set<string>, tagId: Set<string>, currency: Set<string>, timeframe: Set<string>}} appliedFilters 
 * @param {string} query 
 * @param {{start:number, end:number}} customTimeframe
 * @returns {Array<string>} List of Ids, filtered according to parameters
 */
export function getFilteredList(idList, data, appliedFilters, customTimeframe) {

    const filterCategoryList = Object.keys(appliedFilters);

    return idList.filter(
        (id) => {            
            const transactionData = data[id];

            const {title} = transactionData;

            // ---------- check for filters --------
            let isValid = filterCategoryList.reduce(
                (accumulator, category)=>{
                    
                    const category_appliedFilters = appliedFilters[category];                       
                    
                    // no active filters for this category
                    if (appliedFilters[category].size == 0) return accumulator && true;
                    
                    
                    /* ------------------ TYPE -------------------- */
                    if (category == 'type') {
                        return accumulator && 
                            category_appliedFilters.has(getKey(transactionType, transactionData[category]))
                        // console.log(category, transactionData[category], accumulator);
                    }
                    /* -------------- TIMEFRAME ----------- */
                    else if (category == 'timeframe') {
                        
                        const appliedTimeframe = category_appliedFilters.keys().next().value;

                        const {timestamp: {occurredAt}} = transactionData;

                        if (timeframe[appliedTimeframe]) {

                            return accumulator && 
                                DayJSUtils.isWithinTimeframe(timeframe[appliedTimeframe], occurredAt);
                        }
                        else if (customTimeframe) {
                            return accumulator && 
                                (occurredAt >= customTimeframe.start && occurredAt <= customTimeframe.end)
                        }
                        else {
                            consoleError("What's that timeframe?:"+" "+appliedTimeframe);
                        }
                    }
                    /* ------------ EVERYTHING ELSE ---------- */
                    else {
                        return accumulator 
                            && category_appliedFilters.has(transactionData[category]);
                    }                    
                }, true )

            // -------- check for query --------
            // isValid = isValid && (Boolean(query) ? title.toUpperCase().includes(query.toUpperCase()) : true);

            // console.log(transactionData, isValid);

            return isValid;
        }
    )
}


/**
 * 
 * @param {Array<string>} allIds 
 * @param {{id:data}} byId 
 * @param {string} query 
 * @returns {Array<string>} List of Ids, which satisfy search query
 */
export function searchByQuery(allIds = [], byId = {}, query = "") {

    return allIds.filter(id => {
        return byId[id].title.toUpperCase().includes(query.toUpperCase())
    })
}


export function sortTransactionIdList(allIds = [], byId = {}, criteria = '', orderValue = '') {

    if (!criteria || !orderValue) return allIds;

    return allIds.sort( (id1, id2)=> {

        const value1 = getNestedValue(byId[id1], criteria);
        const value2 = getNestedValue(byId[id2], criteria);

        // console.log(value1, value2);

        if (orderValue == sortOrder.ASC) {

            if (typeof value1 == 'string') {
                return value1.localeCompare(value2)
            }
            else if (typeof value1 == 'number') {
                return (value1 - value2);
            }
        }
        else if (orderValue == sortOrder.DESC) {

            if (typeof value1 == 'string') {
                return value2.localeCompare(value1)
            }
            else if (typeof value1 == 'number') {
                return value2 - value1;
            }
        }

    } )
}