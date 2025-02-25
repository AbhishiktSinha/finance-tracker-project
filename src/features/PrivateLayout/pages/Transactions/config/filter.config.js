import { timeframe, transactionType } from "../../../../../enums";
import getAllFiatCurrencies, { convertListToObejct, getAllCurrencyCodeDropdownOptions } from "../../../utils";

import store from "../../../../../redux/store";

const filterConfig = {

    type: {
        default: transactionType.ALL, 
        options: {...transactionType}
    }, 

    currency: {
        default: 'all', 
        options: getAllFiatCurrencies(),
    }, 
    
    tag: {
        default: 'all',
        options: convertListToObejct(store.getState().tags.data, 'id')
    }, 

    timeframe: {
        ...timeframe, 
        'custom_timeframe': {
            start:undefined, 
            end:undefined,
        }
    }

}

export default filterConfig;