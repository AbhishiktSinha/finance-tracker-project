import { memo, useCallback, useMemo, useRef } from 'react'

import { useSelector } from 'react-redux';

import { CheckBoxOutlineBlankRounded, CheckBoxRounded, DeleteOutlineSharp, EditOutlined, } from '@mui/icons-material';

import { wrapper_selectTagData } from '../../../redux/selectors';

import getSymbolFromCurrency from 'currency-symbol-map';
import truncate from 'lodash/truncate';

import { DayJSUtils } from '../../../../../dayjs';
import { transactionType } from '../../../../../enums.js';

import { Tooltip } from 'antd';
import EditModal from '../components/EditModal/index.jsx';
import ModalWrapper from '../../../../../components_common/ModalWrapper/index.jsx';
import DeleteModal from '../components/DeleteModal/index.jsx'

import './sytles.scss'

function TransactionListItem({id, data, isSelected, toggleSelect, toggleShiftSelectHandler, onEdit, onDelete, isBelowWidthThreshold}) {

    const {
        type, tagId, title,
        currency, amount, 
        timestamp: {occurredAt}
    } = data;

    const {name: tagName, color} = useSelector(wrapper_selectTagData(tagId))

    const date = DayJSUtils.format(occurredAt, 'DD/MM/YYYY');

    function handleSelectClick(e) {
        if (e.shiftKey) {
            toggleShiftSelectHandler(id)
        }
        else {
            toggleSelect(id)
        }
    }

    // to handle deletion in case of isSelected
    function clearSelection() {

        if (isSelected) {

            toggleSelect(id);
        }
    }

    // #region DEBUG
    // consoleDebug(`Transaction: ${amount} || ${title} || ${type} || ${tagId} || ${date}`);
    // #endregion
        
    const IconSelected = <CheckBoxRounded />
    const IconUnselected = <CheckBoxOutlineBlankRounded />

    // #region ATTENTION: MODAL-REF
    const deleteModalRef = useRef();
    const editModalRef = useRef();

    const openEditModal = ()=>{editModalRef.current.openModal()}
    const openDeleteModal = ()=>{deleteModalRef.current.openModal()}
    // #endregion

    return (    
        <>
            {/* ------- large screen ui -> list ------------- */}
            {
                !isBelowWidthThreshold && (

                    <li className={"transaction-list-item table-row" + (isSelected?' selected':'')}>
                        
                        {/* ATTENTION: ----------- CHECKBOX ------------- */}
                        <div className="table-cell select-transaction-cell">
                            
                            <span 
                                className={"transaction-item-action select-transaction-item" + (isSelected?" selected": "")}
                                onClick={handleSelectClick}
                            >
                                {
                                    isSelected ? IconSelected : IconUnselected
                                }
                            </span>
                        </div>

                        {/* ATTENTION: ----------- AMOUNT -------------- */}
                        <div className={"table-cell amount-cell" + " " + type}>
                            {/* <TransactionAmount
                                type={type}
                                amount={amount}
                                currency={currency}
                            /> */}
                            <span className="transaction-type">
                                {type == transactionType.INCOME ? "+" : "-"}
                            </span>
                            {' '}

                            <span className="transaction-amount">
                                {getSymbolFromCurrency(currency)}                
                                {amount.toLocaleString()}
                            </span>

                            {' '}
                            <span className="transaction-currency">
                            {`(${currency})`}
                            </span>

                        </div>

                        {/* ATTENTION: ----------- TAG ----------- */}
                        <div className="table-cell tag-cell" >

                            <span 
                                className="tag-chip" 
                                style={{backgroundColor:color}}
                            >
                                {truncate(tagName, {length: 16, omission: '...'})}
                            </span>
                        </div>

                        {/* ATTENTION: ----------- TITLE ------------- */}
                        <div className="table-cell title-cell">
                            {title}
                        </div>
                        
                        {/* ATTENTION: ----------- DATE --------------------- */}
                        <div className="table-cell date-cell">{date}</div>

                        {/* ATTENTION: ----------- ACTIONS ------------------ */}
                        <div className="table-cell transaction-item-actions-cell">

                            <Tooltip
                                title='Delete'
                                arrow={false}
                                rootClassName='transaction-item-action-tooltip'
                                placement='bottom'
                                // open={true}
                            >
                                <span className="transaction-item-action" onClick={openDeleteModal}>
                                    {/* <DeleteOutlineRounded /> */}
                                    <DeleteOutlineSharp />
                                </span>
                            </Tooltip>



                            <Tooltip
                                arrow={false}
                                title='Edit'
                                rootClassName='transaction-item-action-tooltip'
                                placement='bottom'
                            >
                                <span className="transaction-item-action" onClick={openEditModal}>
                                    <EditOutlined/>
                                </span>
                            </Tooltip>

                        </div>
                    </li>
                )
            }
            {/* ----------- small screen ui -> card-like --------------- */}
            {

                isBelowWidthThreshold && (
                    
                    <li className={"transaction-list-item-card table-row" + (isSelected? ' selected': '')}>


                        {/* ATTENTION: ------- CHECKBOX ------------- */}
                        <div className="select-item-container">
                            <div className="table-cell select-transaction-cell">

                                <span
                                    className={"transaction-item-action select-transaction-item" + (isSelected ? " selected" : "")}
                                    onClick={handleSelectClick}
                                >
                                    {
                                        isSelected ? IconSelected : IconUnselected
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="item-details-container">

                            <div className="item-details-row">
                                {/* ATTENTION: ----------- AMOUNT -------------- */}
                                <div className={"table-cell amount-cell" + " " + type}>
                                    {/* <TransactionAmount
                                type={type}
                                amount={amount}
                                currency={currency}
                            /> */}
                                    <span className="transaction-type">
                                        {type == transactionType.INCOME ? "+" : "-"}
                                    </span>
                                    {' '}

                                    <span className="transaction-amount">
                                        {getSymbolFromCurrency(currency)}
                                        {amount.toLocaleString()}
                                    </span>

                                    {' '}
                                    <span className="transaction-currency">
                                        {`(${currency})`}
                                    </span>

                                </div> 

                                {/* ATTENTION: --------- DATE ------------------- */}
                                <div className="table-cell date-cell">{date}</div>                                
                            </div>

                            <div className="item-details-row">
                                {/* ATTENTION: ---------- TAG CHIP ------------ */}
                                <div className="table-cell tag-cell" >

                                    <span
                                        className="tag-chip"
                                        style={{ backgroundColor: color }}
                                    >
                                        {truncate(tagName, { length: 16, omission: '...' })}
                                    </span>
                                </div>                                
                            </div>

                            <div className="item-details-row">
                                {/* ATTENTION: ---------- TITLE ---------------- */}
                                <div className="table-cell title-cell"> {title} </div>                                
                            </div>
                        </div>
                    </li>
                )
                
            }


            {/* ---------------------- MODALS -------------------------- */}
            
            {/* ------ EDIT MODAL -------- */}
            <ModalWrapper ref={editModalRef}>
                <EditModal 
                    id={id}
                    data={data}
                    {...(onEdit && {onEdit: onEdit})}
                />
            </ModalWrapper>

            {/* -------- DELETE MODAL ---------- */}
            <ModalWrapper ref={deleteModalRef}>
                <DeleteModal 
                    id={id} 
                    data={data} 
                    {...(onDelete && {onDelete: onDelete})}
                    
                    callbackModifyUI={clearSelection}
                />
            </ModalWrapper>
        </>
    )
}


export default memo(TransactionListItem);