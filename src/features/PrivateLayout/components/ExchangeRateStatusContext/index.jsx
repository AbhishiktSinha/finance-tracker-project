import { useState, useEffect, useContext } from "react";

import exchangeRateStatusContext from './context';
import { asyncStatus } from "../../../../enums";
import ExchangeRateAPI from "../../../../exchangeRate_api";
import onboardingStatusContext from "../OnboardingAction/context";
import statusContext from "../StateInitializer/context";
import { updateExchangeRateThunk } from "../../redux/thunk";
import { useDispatch } from "react-redux";
import { consoleError } from "../../../../console_styles";

export default function ExchangeRateStatusContext({children}) {
    
    const [exchangeRateStatus, setExchangeRateStatus] = useState(asyncStatus.INITIAL);

    // onboardingStatusContext returns true when 
    // initialState has been successfully fetched and defaultCurrency is set
    const {isOnboardingDone} = useContext(onboardingStatusContext);

    const dispatch = useDispatch();

    useEffect(()=>{
        
        (async ()=>{
            if (isOnboardingDone) {

                // signify api call started
                setExchangeRateStatus(asyncStatus.LOADING);
    
                try {
                    await dispatch(updateExchangeRateThunk());
                    setExchangeRateStatus(asyncStatus.SUCCESS);
                }
                catch(e) {
                    consoleError(e);
                    setExchangeRateStatus(asyncStatus.ERROR);
                }
            }
        })()

    }, [isOnboardingDone])

    return (
        <exchangeRateStatusContext.Provider value={{exchangeRateStatus}} >
            {children}
        </exchangeRateStatusContext.Provider>
    )
}