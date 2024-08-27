import { Modal } from "antd";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import './style.css'
import { consoleDebug } from "../../console_styles";

const ModalWrapper = forwardRef(({children, ...restProps}, ref)=>{

    const [isOpen, setIsOpen] = useState(false);
    
    const openModal = useCallback(()=>{
        setIsOpen(true)
    }, [])
    const closeModal = useCallback(()=>{
        setIsOpen(false)
    }, [])

    // exposing modal state
    useImperativeHandle(ref, ()=>{
        return ({openModal, closeModal, isOpen})
    }, []);

    consoleDebug('ModalWrapper rendered')

    return (
        <div className="modal-wrapper">
            <Modal
                open={isOpen}
                maskClosable={true}
                closable={false}
                closeIcon={<></>}
                keyboard={true}
                onCancel={closeModal}
                centered={true}
                footer={null}
                {...restProps}
            >
                {children}
            </Modal>
        </div>
    )
    
})

export default ModalWrapper;