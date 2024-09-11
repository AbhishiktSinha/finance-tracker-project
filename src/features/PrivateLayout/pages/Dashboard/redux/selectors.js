import { createSelector } from "reselect";

import { consoleInfo } from "../../../../../console_styles";

export const selectDefaultCurrency = ({userDoc})=> userDoc.data?.settings?.defaultCurrency;

/** FIXME:
    This selector runs on change in the value of the defaultCurrency
    Though, for a properly memoized selector, it shouldn't becuase the returned value doesn't change
*/
export const selectIsDefaultCurrencySet = createSelector(selectDefaultCurrency, (defaultCurrency)=>defaultCurrency?true:false);

export const selectStatus = ({userDoc})=> userDoc.status;

