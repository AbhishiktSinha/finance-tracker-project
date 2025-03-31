import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Button, Checkbox, Input } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { Divider } from "@mui/material";

import FilterOption from "../FilterOption";
import CustomTimeframeButton from "../CustomTimeframeButton";

import { searchThroughFilterOptions } from "../../utils";
import { filterDefaults } from "../../defaults";
import { filterTypes, timeframeDisplay, transactionType } from "../../../../../../enums";
import { DayJSUtils } from "../../../../../../dayjs";
import { debounce, getKey } from "../../../../utils";
import { consoleDebug, consoleError, consoleInfo } from "../../../../../../console_styles";
import { useSelector } from "react-redux";
import { selectBalanceData } from "../../../../redux/selectors";


function FilterCategorySection({ category, categoryAppliedFilters, setFilters, categoryOptions, customTimeframe, setCustomTimeframe, appliedTypeFilters }) {        

    const availableOptionsEntries = useMemo(()=>{

        let allOptionsEntries = Object.entries(categoryOptions);

        // if this category depends on type
        if (filterDefaults[category].isTypeDependent) {

            // if there are active type filters 
            if (appliedTypeFilters.size > 0) {

                if (category == 'tagId') {

                    allOptionsEntries = allOptionsEntries.filter( ([id, data]) =>
                            appliedTypeFilters.
                                has(getKey(transactionType, data.category)
                            )
                        )
                }                
            }
        }

        if (filterDefaults[category].showSelectedOnTop) {

            allOptionsEntries = allOptionsEntries.sort((option_1, option_2)=>{

                const option_1_key = option_1[0];
                const option_2_key = option_2[0];

                if (categoryAppliedFilters.has(option_1_key)) return -1;
                else if (categoryAppliedFilters.has(option_2_key)) return 1;
                else return 0;
            })
        }

        return allOptionsEntries

    }, [categoryOptions, appliedTypeFilters]);

    const [displayedOptionsEntries, setDisplayedOptionsEntries] = useState(availableOptionsEntries)

    const searchThroughOptions = debounce((query) => {

        const searchConditions = {
            query: query,
            match: (filterDefaults[category].options_label ?
                filterDefaults[category].options_label : null),
        }

        if (query == '') {
            setDisplayedOptionsEntries(availableOptionsEntries);
        }
        else {
            setDisplayedOptionsEntries(searchThroughFilterOptions(availableOptionsEntries, null, searchConditions));
        }

    }, 240);

    // #region DEBUG-LOG
    consoleInfo(`ALL FILTER OPTIONS FOR ${category} ------ ⤵`);
    console.log(categoryOptions);
    consoleInfo(`AVAILABLE FILTER OPTIONS FOR ${category} ------ ⤵`);
    console.log(availableOptionsEntries);
    consoleInfo(`APPLIED FILTERS FOR ${category} ---------- ⤵`);
    console.log(categoryAppliedFilters)
    // #endregion

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
            
            availableOptionsEntries.forEach(([optionKey, value])=>{
                
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
        
        availableOptionsEntries.forEach(([option_key,option_value])=>{
            
            if (filterDefaults[category].options_label) {
                label_list_by_option[option_key] = filterDefaults[category].options_label.map(
                    label_key => option_value[label_key] )
            }
            else if (category == 'timeframe') {
                if (option_value == categoryOptions.CUSTOM) {

                    if (Boolean(customTimeframe)) {
                        label_list_by_option[option_key] = [`${DayJSUtils.format(customTimeframe.start, 'DD/MM/YYYY')} - 
                                        ${DayJSUtils.format(customTimeframe.end, 'DD/MM/YYYY')}`]
                        
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
                (availableOptionsEntries.length > 9) && (
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
                                        defaultChecked={categoryAppliedFilters.size == availableOptionsEntries.length}
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