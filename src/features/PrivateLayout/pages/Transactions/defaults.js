// import defaults from "../../defaults";

import { filterTypes, timeframe } from "../../../../enums"
import defaults from "../../defaults"


/* if there is no default-filtering for a condition, 
the default filter is undefined */


/* filter being a multiselect value, 
the default options for all the filter values are selected by default */
export const filterDefaults = {
    
    type: {
        filterType: filterTypes.MULTI_SELECT, 
        
        category_label: 'Transaction Type', 
        
        defaultSelected: new Set([]), 
    }, 

    tagId: {
        filterType: filterTypes.MULTI_SELECT, 
        category_label: 'Tag', 

        options_label: ['name'],

        defaultSelected: new Set([]), 
    }, 

    currency: {
        filterType: filterTypes.MULTI_SELECT, 

        category_label: 'Currency',

        options_label: ['code', 'name', 'symbol'],

        defaultSelected: new Set([]),
    }, 

    timeframe: {
        filterType: filterTypes.SINGLE_SELECT, 
        category_label: 'Timeframe',
        //defaultSelected: {} this needs the key, not the value of timeframe.YEAR_DURATION
        defaultSelected: new Set(Object.keys(timeframe).filter(
            (key)=>timeframe[key]==defaults.primaryTransactionsTimeframe))
    }
}

/* order being a single select value, no option is selected by default */
export const orderDefaults = { }