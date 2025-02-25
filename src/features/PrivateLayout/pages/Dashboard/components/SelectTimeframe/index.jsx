import { useContext } from "react";
import activeTimeframeContext from "../../context/ActiveTimeframeContext";
import { Select } from "antd";
import { timeframe } from "../../../../../../enums";

import './styles.scss'

export default function SelectTimeframe() {

    const {activeTimeframe, setActiveTimeframe} = useContext(activeTimeframeContext);

    console.log('context value',activeTimeframe)

    function onChangeSelect(value) {

        console.log(value);

        setActiveTimeframe(value);
    }

    return (
        <div className="select-dashboard-timeframe">
            <Select 
                showSearch={false}
                value={activeTimeframe}
                onChange={onChangeSelect}
                options={[
                    {
                        label: `This Year`,
                        value: timeframe.YEAR
                    }, 
                    {
                        label: `This Month`,
                        value: timeframe.MONTH
                    }, 
                    {
                        label: `This Week`,
                        value: timeframe.WEEK,
                    }
                ]}                
            />
        </div>
    )
}