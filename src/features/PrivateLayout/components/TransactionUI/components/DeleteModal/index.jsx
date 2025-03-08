import { Button } from "antd";
import { useContext, useRef } from "react";
import modalContext from "../../../../../../components_common/ModalWrapper/context";
import ActionButton from "../../../../../../components_common/ActionButton";
import { useDispatch } from "react-redux";
import { deleteTransactionThunk } from "../../../../redux/thunk";
import userAuthContext from "../../../../context/userAuthContext";

import './styles.scss'


export default function DeleteModal({transactionObject, onDelete}) {

    const {id: transactionId, data: transactionData} = transactionObject;

    const {closeModal} = useContext(modalContext);
    const {user: {uid}} = useContext(userAuthContext)

    const deleteButtonRef = useRef();
    const abortButtonRef = useRef();

    const dispatch = useDispatch();
    
    async function handleClick() {

        /*  TODO:
            - Set actionButton to loading
            - call thunk with extraWork
            - close modal or set actionButton active
        */

       deleteButtonRef.current.setButtonLoading();
       abortButtonRef.current.setButtonDisabled();
       
       /* FIXME: :hover:disabled styling */
       /* setTimeout(()=>{
           
           deleteButtonRef.current.setButtonActive();
           abortButtonRef.current.setButtonActive();
        }, 20000) */

        try {

            await dispatch(deleteTransactionThunk(uid, transactionObject, onDelete));

            closeModal();
        }
        catch(e) {

            deleteButtonRef.current.setButtonActive();
            abortButtonRef.current.setButtonActive();
        }
    }

    return (
        <div className="delete-modal-content">
            <h2 className="modal-title">Delete Transaction?</h2>

            <ul className="modal-description">
                <li>Transaction Title: <span>{transactionData.title}</span> </li>
                <li>Transaction Id: <span>{transactionId}</span> </li>
            </ul>

            <div className="buttons-container">
                
                <ActionButton 
                    ref={abortButtonRef} 
                    type='outlined' 
                    onClick={()=>closeModal()}
                >
                    Abort
                </ActionButton>
                
                <ActionButton 
                    ref={deleteButtonRef}
                    type='primary'    
                    onClick={handleClick}                
                >
                    Delete
                </ActionButton>
            </div>
        </div>
    )
}