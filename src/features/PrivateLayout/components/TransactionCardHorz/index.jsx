import { memo, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTag_wrapper } from '../../redux/selectors';
import { DayJSUtils } from '../../../../dayjs';

import TransactionSum from './components/TransactionSum';
import ConvertedSum from './components/ConvertedSum.jsx';

import './styles.scss'
import { Button } from 'antd';
import { DeleteFilled, EditFilled, MoreOutlined, ShareAltOutlined } from '@ant-design/icons';
import TwoArrowsImage from '@assets/two-arrows.png';
import { consoleInfo } from '../../../../console_styles/index.js';
import CardDetailsUI from './components/CardDetailsUI.jsx';
import ModalWrapper from '../../../../components_common/ModalWrapper/index.jsx';
import defaults from './defaults.js';


function TransactionCardHorz({transactionObj}) {

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
                        <h2>Edit Modal</h2>
                    )
                }
                {
                    modalKey == defaults.cardPopoverActions.DELETE && (
                        <h2>Delete Modal</h2>
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


export default memo(TransactionCardHorz);