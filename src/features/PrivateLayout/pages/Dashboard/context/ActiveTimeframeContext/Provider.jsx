import { useState } from "react";
import activeTimeframeContext from ".";
import defaults from "../../defaults";
import { timeframe as timeframeEnum } from "../../../../../../enums";

export default function ActiveTimeframeContextProvider({children}) {

    const [activeTimeframe, setActiveTimeframe] = useState(defaults.activeTimeframe);

    function changeActiveTimeframe(newTimeframe) {                
        setActiveTimeframe(newTimeframe)
    }

    return (
        <activeTimeframeContext.Provider 
            value={{
                activeTimeframe: activeTimeframe, 
                setActiveTimeframe: changeActiveTimeframe
            }}
        >
            {children}
        </activeTimeframeContext.Provider>
    )
}