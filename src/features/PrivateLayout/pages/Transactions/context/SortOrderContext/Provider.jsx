import { useMemo, useState } from "react";
import { orderDefaults } from "../../defaults";
import SortOrderContext from ".";
import { sortOrder } from "../../../../../../enums";
import { consoleSucess } from "../../../../../../console_styles";


export default function SortOrderContextProvider({children}) {

    const defaultOrder = orderDefaults;

    const [appliedOrder, setAppliedOrder] = useState(defaultOrder);

    const orderOptions = useMemo(()=>{
        return {
            title: {
                'A-Z': sortOrder.ASC, 
                'Z-A': sortOrder.DESC,
            }, 
    
            amount: {
                'Amount: Low to High': sortOrder.ASC, 
                'Amount: High to Low': sortOrder.DESC,
            }, 
    
            'timestamp.occurredAt': {
                'Old to New': sortOrder.ASC, 
                'New to Old': sortOrder.DESC,
            }
        }
    }, [])


    function setAppliedOrderHandler(newOrder) {

        if (newOrder) {

            const {criteria, orderKey} = newOrder;

            if (criteria && orderOptions[criteria] && orderOptions[criteria][orderKey] ) {

                consoleSucess('---- setting new order ----')
                console.log(newOrder)
                setAppliedOrder({
                    criteria: criteria, 
                    orderKey: orderKey
                })
            }
        }
    }

    function setDefaultOrder() {
        setAppliedOrder(orderDefaults);
    }

    return (
        <SortOrderContext.Provider 
            value={{
                orderOptions: orderOptions,
                appliedOrder: appliedOrder, 
                setAppliedOrder: setAppliedOrderHandler, 
                setDefaultOrder: setDefaultOrder
            }}
        >
            {children}
        </SortOrderContext.Provider>
    )
}