import { filter } from "lodash";
import { consoleError, consoleInfo } from "../../../../console_styles";
import { getKey } from "../../utils";
import { timeframe, transactionType } from "../../../../enums";
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
 * @param {Array<{id:string, data: object}>} transactionsList 
 * @param {{type:Set<string>, tagId: Set<string>, currency: Set<string>, timeframe: Set<string>}} appliedFilters 
 * @param {string} query 
 */
export function filterTransactions(transactionsList, appliedFilters, query, customTimeframe) {
    const filterCategoryList = Object.keys(appliedFilters)
    console.log('filterCategoryList:',filterCategoryList);
    
    return transactionsList.filter(
        ({id, data}) => {            

            const valid = filterCategoryList.reduce(
                (aggregator, category)=>{
                    
                    const category_appliedFilters = appliedFilters[category];                       
                    
                    // no active filters for this category
                    if (appliedFilters[category].size == 0) return aggregator && true;
                    
                    
                    /* ------------------ TYPE -------------------- */
                    if (category == 'type') {
                        return aggregator && category_appliedFilters.has(getKey(transactionType, data[category]))
                        // console.log(category, data[category], aggregator);
                    }
                    /* -------------- TIMEFRAME ----------- */
                    else if (category == 'timeframe') {
                        
                        const appliedTimeframe = category_appliedFilters.keys().next().value;

                        const {timestamp: {occurredAt}} = data;

                        if (timeframe[appliedTimeframe] && !customTimeframe) {

                            return aggregator && DayJSUtils.isWithinTimeframe(timeframe[appliedTimeframe], occurredAt);
                        }
                        else if (customTimeframe) {
                            return aggregator && (occurredAt >= customTimeframe.start && occurredAt <= customTimeframe.end)
                        }
                        else {
                            consoleError("What's that timeframe?:"+" "+appliedTimeframe);
                        }
                    }
                    /* ------------ EVERYTHING ELSE ---------- */
                    else {
                        return aggregator && category_appliedFilters.has(data[category]);
                    }                    
                }, 
                true
            )

            console.log(data, valid);

            return valid;
        }
    ).filter(
        ({id, data: {title}})=>{
            if (query == '') return true;
            
            return title.toUpperCase().includes(query.toUpperCase());
        }
    )
    
}