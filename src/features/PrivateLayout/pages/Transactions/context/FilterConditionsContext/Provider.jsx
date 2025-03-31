import { useCallback, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import FilterConditionsContext from ".";

import { selectTagsData } from "../../../../redux/selectors";

import { filterDefaults, orderDefaults, queryDefaults } from "../../defaults";
import { sortOrder, timeframe, transactionType } from "../../../../../../enums";
import getAllFiatCurrencies, { convertListToObject, debounce } from "../../../../utils";
import { consoleDebug } from "../../../../../../console_styles";


export default function FilterConditionsContextProvider({children}) {

    const getDefaultFilters = useCallback(() => {
        const initialFilters = {};
        for (const category in filterDefaults) {
            initialFilters[category] = filterDefaults[category].defaultSelected;
        }

        return initialFilters;
    }, [])

    // const tagsList = useSelector(selectTags);
    const tagsData = useSelector(selectTagsData)    

    const [appliedFilters, setAppliedFilters] = useState(getDefaultFilters)

    consoleDebug('------------- APPLIED FILTERS CONTEXT ------------------⤵')
    console.log(appliedFilters)
    

    // TODO: STATEFUL APPLIED ORDER

    const filterOptions = useMemo(()=>{

        return {

            type: {
                INCOME: transactionType.INCOME, 
                EXPENDITURE: transactionType.EXPENDITURE
            }, 

            tagId: tagsData,

            currency: getAllFiatCurrencies(), 

            timeframe: {
                ...timeframe,
                CUSTOM: 'custom_timeframe', // just a flag --> not for direct consumption
            }
        }

    }, [tagsData])    

    
    /* ------------------ CUSTOM IMPLEMENTATIONS STATE-SETTERS --------------- */
    /**
     * Provided filters in the correct format, 
     * this function updates filters to new conditions
     * @param {{type: undefined | Set<string>, tagId: undefined | Set<string>, 
     * currency: undefined | Set<string>, timeframe: string | object}} newFilters 
     */
    function applyFilters(newFilters) {
        
        setAppliedFilters(newFilters)
    }


    function clearFilters() {
        setAppliedFilters(getDefaultFilters());
    }

    /* --------------------- JSX -------------- */

    return (
        <FilterConditionsContext.Provider 
            value={{
                appliedFilters, filterOptions,
                applyFilters, clearFilters
            }}
        >
            {children}
        </FilterConditionsContext.Provider>
    )

}