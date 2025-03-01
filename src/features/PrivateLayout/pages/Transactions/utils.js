import { filter } from "lodash";
import { consoleInfo } from "../../../../console_styles";



/**
 * 
 * @param {Array<[string, object | string]>} data 
 * @param {object} filterConditions 
 * @param {{query:string, match: Array<string> | null}} searchConditions
 * 
 * @returns {Array<[string, object|string]} filteredData
 */
export function filterData(data, filterConditions, searchConditions) {
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