import { Button } from "antd";
import { useRef } from "react";
import ModalWrapper from "../../../../../../components_common/ModalWrapper";
import CustomTimeframeModal from "./CustomTimeframeModal";

export default function CustomTimeframeButton({value, setValue}) {

    const modalRef = useRef();
    const handleClick = ()=>{modalRef.current.openModal()}

    return (
        <div className="custom-timeframe-container">
            <Button onClick={handleClick} type="link">Set Custom Timeframe</Button>
            <ModalWrapper ref={modalRef} className="custom-timeframe-modal-container">
                <CustomTimeframeModal defaultValue={value} submitValue={setValue}/>
            </ModalWrapper>
        </div>
    )
}