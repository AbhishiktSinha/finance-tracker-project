import { useContext } from "react";

import FilterConditionsContext from "../../context/FilterConditionsContext";

import FilterChip from './FilterChip.jsx'

/* 
    TODO: Should this show Quick Filters or Applied Filters
*/
export default function FilterDisplaySection() {

    const {appliedFilters, applyFilters} = useContext(FilterConditionsContext)

    function removeFilter(category, optionKey) {

        const selectedOptions = new Set(appliedFilters[category]);
        selectedOptions.delete(optionKey)

        applyFilters({
            ...appliedFilters, 
            category: selectedOptions
        })
    }

    return (
        <div className="filter-display-section">
            {
                Object.entries(appliedFilters).map(
                    ([category, selectedOptionsSet])=>{

                        return (

                        )
                    }
                )
            }
        </div>
    )
}