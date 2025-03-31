import { useCallback, useContext, useMemo, useState } from "react";
import SortOrderContext from "../../context/SortOrderContext";
import { Button, Popover } from "antd";
import { FilterListRounded } from "@mui/icons-material";
import { consoleDebug } from "../../../../../../console_styles";

export default function SortButton() {

    const {appliedOrder, setAppliedOrder, orderOptions } = useContext(SortOrderContext)

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isOptionSelected = (criteria, orderKey) => {

        return (appliedOrder.criteria == criteria &&
            appliedOrder.orderKey == orderKey)

    }

    const menuOptions = useMemo(()=>{
        
        // return list of JSX
        return (
            <ul className="order-menu-list">
                {
                    Object.entries(orderOptions)
                    .map(([criteria, criteriaOptions])=>{
        
                        // group all the options for each criteria     
                        return (                            
                            Object.keys(criteriaOptions)
                            .map(orderKey => (
                                
                                <li
                                    key={`${criteria}-${orderKey}`}
                                    className={"order-option-item" + (isOptionSelected(criteria, orderKey) ? " selected" : "")}
                                    onClick={() => { handleOptionSelectClick(criteria, orderKey) }}
                                >
                                    {/* {console.log('CRITERIA:', criteria, ' ----- OPTION:', orderKey)} */}
                                    {orderKey}
                                </li>
                            ))
                        )
                    })
                }
            </ul>
        )

    }, [orderOptions, appliedOrder])

    // handle list option click
    function handleOptionSelectClick(criteria, orderKey) {

        // apply new order
        setAppliedOrder({
            "criteria":criteria, 
            "orderKey": orderKey
        });

        // close menu after delay
        setTimeout(()=>{
            setIsMenuOpen(false);
        }, 150)
    }

    function onOpenChange(open) {
        setIsMenuOpen(open);
    }


    // #region DEBUG LOGS
    consoleDebug('------------------ APPLIED SORT ORDER -----------------')
    console.log(appliedOrder)

    return (
        <Popover 
            trigger={'click'}
            onOpenChange={onOpenChange}
            open={isMenuOpen}
            content={menuOptions}
            placement="bottomLeft"
            arrow={false}
            getPopupContainer={(trigger)=>trigger.parentElement}
            rootClassName="popover-menu"
        >
            <Button
                className="transactions-order-button list-action-button"
                shape="round"
                type='outlined'
                ghost
            >
                <FilterListRounded />
                <span className="label">Sort</span>                
            </Button>
        </Popover>
    )

}