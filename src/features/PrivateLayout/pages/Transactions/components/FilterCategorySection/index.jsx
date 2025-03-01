import { memo, useCallback, useContext, useMemo, useState } from "react";

import TempFilterContext from "../FilterModal/context/TempFilterContext";
import FilterConditionsContext from "../../context/FilterConditionsContext";

import { debounce } from "../../../../utils";
import { filterDefaults } from "../../defaults";
import { filterData } from "../../utils";
import { Button, Checkbox, Input } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { filterTypes, timeframeDisplay } from "../../../../../../enums";
import { consoleDebug, consoleInfo } from "../../../../../../console_styles";
import FilterOption from "../FilterOption";
import CustomTimeframeButton from "../CustomTimeframeButton";
import { DayJSUtils } from "../../../../../../dayjs";
import { Divider } from "@mui/material";


function FilterCategorySection({ category, categoryAppliedFilters, setFilters, categoryOptions, customTimeframe, setCustomTimeframe }) {

    // #region DEBUG-LOG
    consoleInfo(`FILTER OPTIONS FOR ${category} ------ ⤵`);
    console.log(categoryOptions);
    consoleInfo(`APPLIED FILTERS FOR ${category} ---------- ⤵`);
    console.log(categoryAppliedFilters)
    // #endregion

    const allOptionsEntries = Object.entries(categoryOptions);

    const [displayedOptionsEntries, setDisplayedOptionsEntries] = useState(allOptionsEntries)

    const searchThroughOptions = debounce((query) => {

        const searchConditions = {
            query: query,
            match: (filterDefaults[category].options_label ?
                filterDefaults[category].options_label : null),
        }

        if (query == '') {
            setDisplayedOptionsEntries(allOptionsEntries);
        }
        else {
            setDisplayedOptionsEntries(filterData(allOptionsEntries, null, searchConditions));
        }

    }, 300);


    /**
     * 
     * @param {string} optionKey 
     * @param {boolean} replace 
     */
    const toggleOptionSelect = useCallback((optionKey, replace) => {

        setFilters(prevFilters => {

            // new set reference to memoise the un-affected categories
            // and re-render just the affected category
            const selectedOptions = new Set(prevFilters[category]);

            if (!replace) {

                if (selectedOptions.has(optionKey)) {
                    selectedOptions.delete(optionKey)
                }
                else {
                    selectedOptions.add(optionKey)
                }
            }
            else {

                selectedOptions.clear();
                selectedOptions.add(optionKey);
            }

            return {
                ...prevFilters,
                [category]: selectedOptions
            }
        })

    }, [])

    const toggleSelectAll = useCallback((select) => {

        if (!select) {
            setFilters(prevFilters => ({
                ...prevFilters,
                [category]: new Set([]),
            }))
        }
        else {

            /* const selectedOptionsAll = new Set(categorySelectedOptions);
            
            allOptionsEntries.forEach(([optionKey, value])=>{
                
                selectedOptionsAll.add(optionKey)
            }) */

            setFilters(prevFilters => ({
                ...prevFilters,
                [category]: new Set(Object.keys(categoryOptions))
            }))
        }
    }, [])


    const label_list = useMemo(()=>{

        const label_list_by_option = {};
        
        allOptionsEntries.forEach(([option_key,option_value])=>{
            
            if (filterDefaults[category].options_label) {
                label_list_by_option[option_key] = filterDefaults[category].options_label.map(
                    label_key => option_value[label_key] )
            }
            else if (category == 'timeframe') {
                if (option_value == categoryOptions.CUSTOM) {

                    if (Boolean(customTimeframe)) {
                        label_list_by_option[option_key] = [`${DayJSUtils.format(customTimeframe.start, 'YYYY/MM/DD')} - 
                                        ${DayJSUtils.format(customTimeframe.end, 'YYYY/MM/DD')}`]
                        
                        return;
                    }
                }

                label_list_by_option[option_key] = [timeframeDisplay[option_key]];
            }
            else {
                label_list_by_option[option_key] = [option_value];
            }
        })

        return label_list_by_option

    }, [customTimeframe])


    /* ------------------------- return J S X --------------- */

    return (
        <div className="filter-category-section">
            {
                (allOptionsEntries.length > 9) && (
                    <div className="search-select-all-action-container filter-options-action-container">

                        <Input
                            variant='borderless'
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            onChange={(e) => { searchThroughOptions(e.target.value) }}
                        />                        

                        {/* -------- select all only for MULTI-SELECT ----------- */}
                        {
                            filterDefaults[category].filterType == filterTypes.MULTI_SELECT && (

                                <div className="select-all-container">

                                    <Checkbox
                                        className="select-all-checkbox"
                                        defaultChecked={categoryAppliedFilters.size == allOptionsEntries.length}
                                        onChange={(e) => { toggleSelectAll(e.target.checked) }}
                                    >Select All</Checkbox>
                                </div>
                            )
                        }
                        {/* ---------- custom timeframe only for TIMFRAME category ----------*/}
                        {/* {
                            category == 'timeframe' && (
                                <CustomTimeframeButton
                                    value={customTimeframe}
                                    setValue={setCustomTimeframe}
                                />
                            )
                        } */}

                        
                    </div>
                )

            }

            {
                category=='timeframe' &&
                <div className="filter-options-action-container custom-timeframe-action-container">
                    <CustomTimeframeButton
                        value={customTimeframe}
                        setValue={setCustomTimeframe}
                    /> 
                    <Divider />
                </div>
            }

            <ul className={"category-filter-options-list"}>
                {
                    displayedOptionsEntries.map(
                        ([key, value]) => {

                            return (
                                <FilterOption
                                    key={category + key}
                                    optionKey={key}

                                    label_list={label_list[key]}

                                    disabled={category == 'timeframe' && value == categoryOptions.CUSTOM && !Boolean(customTimeframe)}

                                    category={category}
                                    isSelected={categoryAppliedFilters.has(key)}
                                    toggleOption={toggleOptionSelect}
                                />)
                        }
                    )
                }
            </ul>
        </div>
    )

}


export default memo(FilterCategorySection);