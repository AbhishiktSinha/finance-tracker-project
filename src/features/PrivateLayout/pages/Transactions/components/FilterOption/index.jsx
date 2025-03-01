import { Checkbox } from "antd";
import { filterDefaults } from "../../defaults";
import { filterTypes, timeframeDisplay } from "../../../../../../enums";
import { memo } from "react";
import { consoleDebug } from "../../../../../../console_styles";

function FilterOption({optionKey, disabled, label_list, category, isSelected, toggleOption, customTimeframe}) {

    consoleDebug(`${optionKey} --------- OPTION RENDERED --------- 🔳`);
    
    return (
        <li className="category-filter-option">

            <Checkbox 
                checked={isSelected}
                onChange={()=>{
                    toggleOption(
                        optionKey, 
                        filterDefaults[category].filterType == filterTypes.SINGLE_SELECT
                    )
                }}

                disabled={Boolean(disabled)}
            >
                
                {
                    label_list.map(
                        (label, index) => (<span key={label+""+index} className="filter-option-label">{label}</span>)
                    )                    
                }

            </Checkbox>
        </li>
    )
}

export default memo(FilterOption);