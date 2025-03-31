import { FilterAltRounded } from "@mui/icons-material";
import { Button } from "antd";
import ModalWrapper from "../../../../../../components_common/ModalWrapper";
import FilterModal from "../FilterModal";
import { useContext, useRef } from "react";
import FilterConditionsContext from "../../context/FilterConditionsContext";
import Badge from "../../../../../../components_common/Badge";

export default function FilterButton() {

    const {appliedFilters} = useContext(FilterConditionsContext)

    const getActiveFilterCategoriesCount = ()=>{
        let count = 0;
        for (let categoryKey in appliedFilters) {
            if (appliedFilters[categoryKey].size > 0) {
                count++;
            }
        }

        return count;
    }

    const filterModalRef = useRef();
    function openFilterModal() {
        filterModalRef.current.openModal()
    }
    function closeFilterModal() {
        filterModalRef.current.closeModal();
    }

    return (
        <>
            <Button
                className="transactions-filter-button list-action-button"
                shape="round"
                type="outlined"
                ghost
                onClick={openFilterModal}
            >
                <FilterAltRounded />
                <span className="label">Filter</span>
                <Badge count={getActiveFilterCategoriesCount()} />
                
            </Button>

            <ModalWrapper ref={filterModalRef} className='transactions-filter-modal-container'>
                <FilterModal />
            </ModalWrapper>            
        </>
    )
}