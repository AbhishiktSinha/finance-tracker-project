import { useSelector } from "react-redux";
import { selectDefaultCurrency } from "../../../../features/PrivateLayout/redux/selectors";
import { Button } from "antd";
import { useContext, useRef } from "react";
import onboardingStatusContext from "../../../../features/PrivateLayout/components/OnboardingAction/context";
import { Skeleton } from "@mui/material";
import ModalWrapper from "../../../ModalWrapper";
import DefaultCurrencyModal from "../DefaultCurrencyModal";



export default function DefaultCurrencyActionButton() {

    const defaultCurrency = useSelector(selectDefaultCurrency);
    const code = defaultCurrency?.code;
    const symbol = defaultCurrency?.symbol;

    const currencyModalRef = useRef();

    function handleClick() {
        currencyModalRef.current.openModal();
    }

    
    if (!defaultCurrency) {
        return (
            <div className="navbar-action-button-skeleton default-currency-action-button-skeleton">
                <Skeleton variant="rounded" className="skeleton-content" animation='wave'/>
            </div>
        )
    }

    return (
        <>
            <Button
                shape="round" 
                type='primary' 
                className="navbar-action-button default-currency-action-button no-hover"
                onClick={handleClick}
            >
                {code.toUpperCase()} {symbol}
            </Button>
            
            <ModalWrapper ref={currencyModalRef} >
                <DefaultCurrencyModal defaultCurrency={defaultCurrency}/>
            </ModalWrapper>
        </>
    )
}