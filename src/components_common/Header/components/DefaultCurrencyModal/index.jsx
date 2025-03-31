import { Button, Divider, Select } from "antd";
import { getAllCurrencyCodeDropdownOptions } from "../../../../features/PrivateLayout/utils";

import './styles.scss'
import ActionButton from "../../../ActionButton";
import { useContext, useMemo, useRef, useState } from "react";
import modalContext from "../../../ModalWrapper/context";
import { useDispatch, useSelector } from "react-redux";
import { changeDefaultCurrencyThunk } from "../../../../features/PrivateLayout/redux/thunk";
import userAuthContext from "../../../../features/PrivateLayout/context/userAuthContext";
import { selectBalanceData, selectBalanceDataList } from "../../../../features/PrivateLayout/redux/selectors";



/* TODO:
    Add Select value state
    consumer uid from context
 */
export default function DefaultCurrencyModal({defaultCurrency}) {

    const balanceData = useSelector(selectBalanceDataList);
    const availableBalanceCurrencies = useMemo(()=>{
        
        const result = {};
        balanceData.forEach(
            ({id, data: {currency}}) => {
                result[currency] = currency
            }
        )

        return result;
    }, [balanceData])
    
    const options = getAllCurrencyCodeDropdownOptions();
    const availableCurrencyOptions = options.filter(
        ({value})=> Boolean(availableBalanceCurrencies[value])
    );
    const otherCurrencyOptions = options.filter(
        ({value})=> !Boolean(availableCurrencyOptions[value])
    )

    const actionButtonRef = useRef();
    
    const { closeModal } = useContext(modalContext)
    const { user: { uid } } = useContext(userAuthContext)

    const [selectedValue, setSelectedValue] = useState(defaultCurrency.code);


    function handleChange(value) {
        setSelectedValue(value);
    }
    
    const dispatch = useDispatch();
    async function handleClick() {

        actionButtonRef.current.setButtonLoading();

        try {

            await dispatch(changeDefaultCurrencyThunk(uid, selectedValue));

            closeModal();
        }
        catch(e) {
            console.log(e)
            actionButtonRef.current.setButtonActive();
        }
    }

    return (
        <div className="default-currency-modal">
            <h2 className="modal-title">Select Default Currency</h2>
            <div className="selection-container">
                
                <Select 
                    value={selectedValue}
                    onChange={handleChange}
                    options={options}                    
                    showSearch
                />
                {/* <Button type="primary" shape="round">Confirm</Button> */}
                <ActionButton 
                    type='primary'
                    shape='round'
                    ref={actionButtonRef}
                    onClick={handleClick}
                >
                    Confirm
                </ActionButton>

            </div>
        </div>
    )
}