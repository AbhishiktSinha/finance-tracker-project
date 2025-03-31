import { useContext, useRef } from "react";
import userAuthContext from "../../../../context/userAuthContext";
import { useDispatch } from "react-redux";
import { deleteTransactionsListThunk } from "../../../../redux/thunk";
import { consoleDebug } from "../../../../../../console_styles";
import modalContext from "../../../../../../components_common/ModalWrapper/context";
import ActionButton from "../../../../../../components_common/ActionButton";

import '../../styles/confirm-modal-styles.scss'


/**
 * 
 * @param {object} param0 props
 * @param {Array<{id:string, data:object}>} param0.selectedTransactionsList
 * @param {Function} param0.onDeleteList
 * @returns 
 */
export default function DeleteSelectedModal({selectedTransactionsList, onDeleteList, callbackModifyUI}) {

    consoleDebug('------- DELETE SELECTED MODAL RENDERED ------------')
    console.log('props:', selectedTransactionsList, onDeleteList)

    
    const {user: {uid}} = useContext(userAuthContext);

    const {closeModal} = useContext(modalContext);    

    const deleteButtonRef = useRef();
    const abortButtonRef = useRef();

    const dispatch = useDispatch();
    
    async function handleClick() {

       deleteButtonRef.current.setButtonLoading();
       abortButtonRef.current.setButtonDisabled();
       
       /* FIXME: :hover:disabled styling */
       /* setTimeout(()=>{
           
           deleteButtonRef.current.setButtonActive();
           abortButtonRef.current.setButtonActive();
        }, 20000) */

        try {

            // await dispatch(deleteTransactionThunk(uid, transactionObject, onDeleteList));
            await dispatch(deleteTransactionsListThunk(uid, selectedTransactionsList, onDeleteList));

            callbackModifyUI && callbackModifyUI()
            closeModal();
        }
        catch(e) {

            deleteButtonRef.current.setButtonActive();
            abortButtonRef.current.setButtonActive();
        }
    }

    return (
        <div className="delete-modal-content transaction-action-confirm-modal">
            <h2 className="modal-title">Delete Selected Transactions?</h2>

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