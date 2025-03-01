import { useContext, useState } from "react";
import { Button, Tabs } from "antd";


import FilterConditionsContext from "../../context/FilterConditionsContext";
import TempFilterContext from "./context/TempFilterContext";

import FilterCategorySection from '../FilterCategorySection/index.jsx'

import { filterDefaults } from "../../defaults";

import './styles.scss'
import modalContext from "../../../../../../components_common/ModalWrapper/context/index.jsx";
import TransactionsInitializerContext from "../../context/TransactionsInitializerContext/index.jsx";

export default function FilterModal({ children }) {

    const { appliedFilters, filterOptions, applyFilters } = useContext(FilterConditionsContext)
    const {getCustomTimeframe, setCustomTimeframe} = useContext(TransactionsInitializerContext)
    
    const {closeModal} = useContext(modalContext);

    const [filters, setFilters] = useState(appliedFilters)
    const [tempCustomTimeframe, setTempCustomTimeframe] = useState(getCustomTimeframe);

    const setCustomTimeframeRange = (start, end)=> {
        setTempCustomTimeframe({start: start, end: end});
    }


    const tabItems = Object.keys(filterDefaults).map(categoryKey => ({
            key: categoryKey,
            label: filterDefaults[categoryKey].category_label,
            children: <FilterCategorySection
                category={categoryKey}
                categoryAppliedFilters={filters[categoryKey]}
                categoryOptions={filterOptions[categoryKey]}
                setFilters={setFilters}
                {...(categoryKey == 'timeframe' && {customTimeframe: tempCustomTimeframe} )}
                {...(categoryKey == 'timeframe' && {setCustomTimeframe: setCustomTimeframeRange} )}
            />
        })
    )

    function onClose(){ 
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

    return (
        <TempFilterContext.Provider value={{ filters, setFilters }} >
            <div className="transactions-filter-modal">

                <header className="modal-header">Filter Transactions</header>

                <Tabs
                    tabPosition="left"
                    items={tabItems}
                    className="filter-category-tabs"
                />
                
                <footer className="modal-footer">
                    <Button 
                        className="filter-modal-action-button" 
                        type="primary-inverted" 
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