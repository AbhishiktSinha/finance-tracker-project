import { useContext, useEffect, useState } from "react";
import { Button, Tabs } from "antd";

import FilterConditionsContext from "../../context/FilterConditionsContext";
import TempFilterContext from "./context/TempFilterContext";
import TransactionsInitializerContext from "../../context/TransactionsInitializerContext/index.jsx";
import modalContext from "../../../../../../components_common/ModalWrapper/context/index.jsx";

import FilterCategorySection from '../FilterCategorySection/index.jsx'
import FilterCategoryLabel from "../FilterCategoryLabel/index.jsx";

import { filterDefaults } from "../../defaults";
import { filterTypes, timeframe } from "../../../../../../enums.js";
import { consoleInfo } from "../../../../../../console_styles/index.js";

import './styles.scss'

export default function FilterModal({ children }) {

    const { appliedFilters, filterOptions, applyFilters, clearFilters } = useContext(FilterConditionsContext)
    const { getCustomTimeframe, setCustomTimeframe } = useContext(TransactionsInitializerContext)

    const { closeModal } = useContext(modalContext);

    const [filters, setFilters] = useState(appliedFilters)
    const [tempCustomTimeframe, setTempCustomTimeframe] = useState(getCustomTimeframe);

    const setCustomTimeframeRange = (start, end) => {
        // set CUSTOM value
        setTempCustomTimeframe({ start: start, end: end });

        // select CUSTOM 
        setFilters( previousFilters => {
            return {
                ...previousFilters, 
                timeframe: new Set(['CUSTOM'])
            }
        })
    }


    /* const tabItems = Object.keys(filterDefaults).map(categoryKey => ({
            key: categoryKey,
            
            label: <FilterCategoryLabel 
                label={filterDefaults[categoryKey].category_label}
                selectedCount={filters[categoryKey].size}
                isSingleSelect={filterDefaults[categoryKey].filterType == filterTypes.SINGLE_SELECT}
                />,
            children: <FilterCategorySection
                category={categoryKey}
                categoryAppliedFilters={filters[categoryKey]}
                categoryOptions={filterOptions[categoryKey]}
                setFilters={setFilters}
                {...(categoryKey == 'timeframe' && {customTimeframe: tempCustomTimeframe} )}
                {...(categoryKey == 'timeframe' && {setCustomTimeframe: setCustomTimeframeRange} )}
                {...(categoryKey == 'tagId' && {appliedTypeFilters: filters.type}) }
            />
        })
    ) */

    function onClose() {
        closeModal();
    }
    function onApply() {
        applyFilters(filters)

        // if tempCustomTimeframe exists, ---> user has set Custom Timeframe
        if (tempCustomTimeframe) {
            setCustomTimeframe(tempCustomTimeframe.start, tempCustomTimeframe.end);
        }

        closeModal();
    }
    

    /* ------- effect for CLEAR FILTERS -------- */
    useEffect(()=>{
        setFilters(appliedFilters)
    }, [appliedFilters])

    return (
        <TempFilterContext.Provider value={{ filters, setFilters }} >
            <div className="transactions-filter-modal">

                <header className="modal-header">

                    <h2 className="modal-title">Filter Transactions</h2>

                    <Button type="link" onClick={()=>{clearFilters()}}>Clear Filters</Button>
                </header>

                <Tabs
                    tabPosition="left"
                    items={
                        Object.keys(filterDefaults).map(categoryKey => ({
                            key: categoryKey,

                            destroyInactiveTabPane: true, 

                            label: <FilterCategoryLabel
                                label={filterDefaults[categoryKey].category_label}
                                selectedCount={filters[categoryKey].size}
                                isSingleSelect={filterDefaults[categoryKey].filterType == filterTypes.SINGLE_SELECT}
                            />,
                            children: <FilterCategorySection
                                category={categoryKey}
                                categoryAppliedFilters={filters[categoryKey]}
                                categoryOptions={filterOptions[categoryKey]}
                                setFilters={setFilters}
                                {...(categoryKey == 'timeframe' && { customTimeframe: tempCustomTimeframe })}
                                {...(categoryKey == 'timeframe' && { setCustomTimeframe: setCustomTimeframeRange })}
                                {...(categoryKey == 'tagId' && { appliedTypeFilters: filters.type })}
                            />
                        }) )
                    }
                    onChange={(activeKey)=>consoleInfo(`-------- SELECTED TAB --> ${activeKey} ---------------`)}
                    className="filter-category-tabs"
                />

                <footer className="modal-footer">
                    <Button
                        className="filter-modal-action-button"
                        type="outlined"
                        ghost
                        onClick={onClose}
                    >
                        Close
                    </Button>

                    <Button
                        className="filter-modal-action-button"
                        type="primary-inverted"
                        onClick={onApply}
                    >Apply</Button>

                </footer>
            </div>
        </TempFilterContext.Provider>
    )
}