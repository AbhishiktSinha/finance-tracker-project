import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

import modalContext from './context'

import './style.css'

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
        return (
            {
                ...ref.current, 
                openModal, closeModal, isOpen
            }
        )
    }, []);

    /* ATTENTION   ----------- looky here ⤵
    Closing modal now destroys the node itself */
    if (!isOpen) {
        return (
            <>
            </>
        )
    }

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
                {/* context to allow children - like forms to control closing the modal */}
                <modalContext.Provider 
                    value={ { closeModal } }
                >
                    {children}
                </modalContext.Provider>

            </Modal>
        </div>
    )
    
})

export default ModalWrapper;