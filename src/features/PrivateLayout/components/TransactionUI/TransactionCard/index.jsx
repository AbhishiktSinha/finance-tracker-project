import { memo, useMemo, useRef, useState } from 'react';

import CardDetailsUI from './components/CardDetailsUI.jsx';
import ModalWrapper from '../../../../../components_common/ModalWrapper/index.jsx';

import EditModal from '../components/EditModal/index.jsx';
import DeleteModal from '../components/DeleteModal/index.jsx';

import { consoleInfo } from '../../../../../console_styles/index.js';
import defaults from './defaults.js';

import './styles.scss'


function TransactionCard({transactionObj, onEdit, onDelete}) {

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
                transactionObj={transactionObj}
                openModal={openModal}
            />
            <ModalWrapper ref={modalRef}>
                {
                    modalKey == defaults.cardPopoverActions.EDIT && (
                        // <h2>Edit Modal</h2>
                        <EditModal 
                            transactionObject={transactionObj} 
                            {...(onEdit && {'onEdit': onEdit})}                            
                        />
                    )
                }
                {
                    modalKey == defaults.cardPopoverActions.DELETE && (
                        // <h2>Delete Modal</h2>
                        <DeleteModal 
                            transactionObject={transactionObj}
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