import { memo, useMemo, useRef, useState } from 'react';

import CardDetailsUI from './components/CardDetailsUI.jsx';
import ModalWrapper from '../../../../../components_common/ModalWrapper/index.jsx';

import EditModal from '../components/EditModal/index.jsx';
import DeleteModal from '../components/DeleteModal/index.jsx';

import { consoleInfo } from '../../../../../console_styles/index.js';
import defaults from './defaults.js';

import './styles.scss'
import { useSelector } from 'react-redux';
import { wrapper_selectPrimaryTransactionData } from '../../../redux/selectors.js';


function TransactionCard({id: transactionId, onEdit, onDelete}) {

    const transactionData = useSelector(wrapper_selectPrimaryTransactionData(transactionId))

    /* ---------- modal stuff ---------- */
    const [modalKey, setModalKey] = useState('');

    const modalRef = useRef(null);

    function openModal(key) {
        consoleInfo(`---------- ${key} MODAL OPENED ----------------`)
        
        setModalKey(key);
        modalRef.current?.openModal();
    }

    return (
        <>
            <CardDetailsUI
                id={transactionId}
                data={transactionData}
                openModal={openModal}
            />
            <ModalWrapper ref={modalRef}>
                {
                    modalKey == defaults.cardPopoverActions.EDIT && (
                        // <h2>Edit Modal</h2>
                        <EditModal 
                            id={transactionId}
                            data={transactionData}
                            transactionObject={transactionData} 
                            {...(onEdit && {'onEdit': onEdit})}                            
                        />
                    )
                }
                {
                    modalKey == defaults.cardPopoverActions.DELETE && (
                        // <h2>Delete Modal</h2>
                        <DeleteModal 
                            id={transactionId}
                            data={transactionData}                    
                            {...(onDelete && {'onDelete': onDelete})}
                        />
                    )
                }
                {
                    modalKey == defaults.cardPopoverActions.SHARE && (
                        <h2>Share Modal</h2>
                    )
                }
            </ModalWrapper>
        </>
    )
}


export default memo(TransactionCard);