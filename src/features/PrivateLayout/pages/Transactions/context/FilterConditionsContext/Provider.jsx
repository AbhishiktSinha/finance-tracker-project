import { useSelector } from "react-redux";

import { selectTags } from "../../../../redux/selectors";

import { filterDefaults, orderDefaults } from "../../defaults";
import { useMemo, useState } from "react";
import { timeframe, transactionType } from "../../../../../../enums";
import getAllFiatCurrencies, { convertListToObject } from "../../../../utils";
import FilterConditionsContext from ".";
import { consoleDebug } from "../../../../../../console_styles";


export default function FilterConditionsContextProvider({children}) {

    const tagsList = useSelector(selectTags);

    consoleDebug('tagsList in FILTER_CONDITIONS_CONTEXT');
    console.log(tagsList);

    const [appliedFilters, setAppliedFilters] = useState(()=>{
        const initialFilters = {};
        for (const category in filterDefaults) {
            initialFilters[category] = filterDefaults[category].defaultSelected;
        }

        return initialFilters;
    })

    consoleDebug('------------- APPLIED FILTERS CONTEXT ------------------⤵')
    console.log(appliedFilters)
    

    // TODO: STATEFUL APPLIED ORDER

    const filterOptions = useMemo(()=>{

        return {

            type: {
                INCOME: transactionType.INCOME, 
                EXPENDITURE: transactionType.EXPENDITURE
            }, 

            tagId: convertListToObject(tagsList, 'id'), 

            currency: getAllFiatCurrencies(), 

            timeframe: {
                ...timeframe,
                CUSTOM: 'custom_timeframe', // just a flag --> not for direct consumption
            }
        }

    }, [tagsList])

    
    const orderOptions = useMemo(()=>{
        return {
            title: {
                'A-Z': 'asc', 
                'Z-A': 'desc',
            }, 
    
            amount: {
                'LOW TO HIGH': 'asc', 
                'HIGH TO LOW': 'desc',
            }, 
    
            'timeframe.occurredAt': {
                'OLD TO NEW': 'asc', 
                'NEW TO OLD': 'desc',
            }
        }
    }, [])

    
    /**
     * Provided filters in the correct format, 
     * this function updates filters to new conditions
     * @param {{type: undefined | Set<string>, tagId: undefined | Set<string>, 
     * currency: undefined | Set<string>, timeframe: string | object}} newFilters 
     */
    function applyFilters(newFilters) {
        
        setAppliedFilters(newFilters)
    }

    /**
     * 
     * @param {{orderParameter:string}} newOrder an object with a single -> order parameter key:value pair, picked from the order options
     */
    function applyOrder(newOrder) {

    }

    /* --------------------- JSX -------------- */

    return (
        <FilterConditionsContext.Provider 
            value={{
                appliedFilters, 
                filterOptions, orderOptions,
                applyFilters, applyOrder, 
            }}
        >
            {children}
        </FilterConditionsContext.Provider>
    )

}