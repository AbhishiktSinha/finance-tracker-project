import { useContext, useRef } from "react";
import userAuthContext from "../../../../context/userAuthContext";
import { useDispatch } from "react-redux";
import { deleteTransactionsListThunk } from "../../../../redux/thunk";


export default function DeleteSelectedModal({selectedTransactionsList, onDelete}) {

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

            // await dispatch(deleteTransactionThunk(uid, transactionObject, onDelete));
            await dispatch(deleteTransactionsListThunk(uid, selectedTransactionsList, onDelete));

            closeModal();
        }
        catch(e) {

            deleteButtonRef.current.setButtonActive();
            abortButtonRef.current.setButtonActive();
        }
    }

    return (
        <div className="delete-modal-content">
            <h2 className="modal-title">Delete Selected Transactions Transaction?</h2>

            {/* <ul className="modal-description">
                <li>Transaction Title: <span>{transactionData.title}</span> </li>
                <li>Transaction Id: <span>{transactionId}</span> </li>
            </ul> */}            

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