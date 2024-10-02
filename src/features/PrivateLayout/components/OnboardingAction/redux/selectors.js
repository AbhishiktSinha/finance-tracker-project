import { createSelector } from "reselect";
import { selectDefaultCurrency } from "../../../redux/selectors";

export const selectIsDefaultCurrencySet = createSelector(selectDefaultCurrency, (defaultCurrency)=>defaultCurrency?true:false);
