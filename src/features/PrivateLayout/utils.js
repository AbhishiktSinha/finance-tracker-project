import currencyToSymbolMap from 'currency-symbol-map/map';
import { changeType } from '../../enums';

export const getAllCurrencyCodeDropdownOptions = ()=>{
    return Object.keys(currencyToSymbolMap).map(code => {
        return {
            label: code, 
            value: code
        }
    })
}

/**
 * 
 * @param {Array<string>} statusList Array of all the `status` fields that the route depends on
 * @param {isOnboardingDone} isOnboardingDone true | false value denoting the status of onboarding
 */
export function checkDisplayUI (statusList = [], isOnboardingDone) {
    
    let showUI = true;
    // if any one of the dependency status is loading or initial, don't show UI
    statusList.forEach( statusItem => {
        
        if (statusItem == 'loading' || statusItem == 'initial') {
            showUI = false;
        }
    })

    if (isOnboardingDone != undefined) {
        
        if (showUI && isOnboardingDone==false) {
            showUI = false;
        }
    }

    return showUI;
}

export function getChangeType(oldValue, newValue) {

    if (oldValue < newValue) {
        return changeType.POSITIVE
    }
    else if (oldValue > newValue) {
        return changeType.NEGATIVE
    }
    else {
        return changeType.NONE;
    }
}

export function getValueChangePercentage(oldValue, newValue) {

    const change = Math.abs(newValue - oldValue);

    if (change == 0) { return 0}
    else if(oldValue == 0) { return Infinity }
    else { return ( (change/oldValue) * 100 )};
}