import { useCallback, useContext, useMemo, useRef, useState } from "react";

import { Button, Input } from "antd";
import { CheckBoxOutlineBlankRounded, CheckBoxRounded, DeleteOutline, EditOutlined, IndeterminateCheckBoxRounded, SearchOff, SearchOutlined, UploadFileOutlined } from "@mui/icons-material";
import { FilterAltRounded, FilterListRounded } from "@mui/icons-material";

import FilterConditionsContext from "../../context/FilterConditionsContext";
import SearchQueryContext from "../../context/SearchQueryContext";
import TransactionsInitializerContext from "../../context/TransactionsInitializerContext";

import FilterButton from "../FilterButton";
import SortButton from '../SortButton'
import TransactionListItem from "../../../../components/TransactionUI/TransactionListItem";

import { getFilteredList, searchByQuery, sortTransactionIdList } from "../../utils";
import { asyncStatus } from "../../../../../../enums";
import { consoleDebug, consoleInfo } from "../../../../../../console_styles";

import './styles.scss'
import SortOrderContext from "../../context/SortOrderContext";
import ModalWrapper from "../../../../../../components_common/ModalWrapper";
import DeleteSelectedModal from "../../../../components/TransactionUI/components/DeleteSelectedModal";
import useIsScreenMaxWidth from "../../../../../../custom_hooks/useIsScreenMaxWidth";
import AutoHideHeader from "../../../../../../components_common/AutoHideHeader";
import ExportSelectedModal from "../../../../components/TransactionUI/components/ExportSelectedModal";

export default function TransactionsListContainer() {

    const { transactionsInitializer, getCustomTimeframe,
        onEdit, onDelete, onDeleteList } = useContext(TransactionsInitializerContext);

    const { appliedFilters } = useContext(FilterConditionsContext)
    const { query } = useContext(SearchQueryContext);
    const { appliedOrder, orderOptions } = useContext(SortOrderContext)

    const isBelowWidthThreshold = useIsScreenMaxWidth(824);

    const { status, data: { byId, allIds }, error } = transactionsInitializer;


    // SELECTED TRANSACTIONS STATE
    const [selectedItems, setSelectedItems] = useState(new Set());

    // ----------- all ids in the current filter conditions --------
    const filteredIdList = useMemo(() => {
        if (status == asyncStatus.SUCCESS) {

            return getFilteredList(allIds, byId,
                appliedFilters, getCustomTimeframe()
            )
        }
        else {
            return [];
        }
    }, [appliedFilters, allIds]);

    // ----------- ids that satisfy search query ----------
    const searchFilteredIdList = status == asyncStatus.SUCCESS ?
        searchByQuery(filteredIdList, byId, query) :
        [];

    // ----------------------- SORTED LIST -----
    // const sortedList = [...searchFilteredIdList];
    const sortedList = sortTransactionIdList(searchFilteredIdList, byId,
        appliedOrder.criteria, orderOptions[appliedOrder.criteria]?.[appliedOrder.orderKey])



    consoleInfo('----------- SORTED LIST OF TRANSACTION LIST ITEMS -------------');
    console.log(sortedList);
    consoleInfo('---------- SELECTED TRANSACTION ITEM IDS ----------------')
    console.log(selectedItems);


    /* ---------- SELECT ITEM ------------- */
    const toggleSelectTransaction = useCallback((transactionId) => {

        setSelectedItems(selectedTransactions => {

            // create a new reference, 
            // because we are essentially dealing with a stateful object
            const selection = new Set(selectedTransactions);

            if (selection.has(transactionId)) selection.delete(transactionId);
            else selection.add(transactionId);

            return selection;
        })
    }, [setSelectedItems])


    const toggleShiftSelectHandler = useCallback((transactionId) => {

        setSelectedItems(selectedItems => {
            const lastSelectedId = Array.from(selectedItems)[selectedItems.size - 1]
            const previous_index = sortedList.indexOf(lastSelectedId);
            const current_index = sortedList.indexOf(transactionId);

            const targetIdList = current_index > previous_index ?
                sortedList.slice(previous_index, current_index + 1) :
                sortedList.slice(current_index, previous_index + 1).reverse();


            const toSelectTarget = !selectedItems.has(transactionId);

            const newSelection = new Set(selectedItems);

            // select target if it's not already selected and vice-versa
            targetIdList.forEach(id => {

                // if toSelectTarget --> not selected yet --> to be selected
                if (toSelectTarget) {

                    !selectedItems.has(id) && newSelection.add(id);
                }
                // else if !toSelectTarget --> already selected ---> to be un-selected
                else {
                    selectedItems.has(id) && newSelection.delete(id);
                }

            })

            return newSelection
        })

    }, [setSelectedItems])

    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
    }, [setSelectedItems])


    // #region ATTENTION: ------------ MODALS -----------
    const deleteListRef = useRef(null);
    const exportListRef = useRef(null);

    function openDeleteListModal() {
        deleteListRef.current.openModal();
    }

    function openExportListModal() {
        exportListRef.current.openModal();
    }

    // #endregion


    // #region ATTENTION: ------- ref for autoHide header ---------
    const scrollingParentRef = useRef();

    /* ------------------------------------------  SKELETONS ------------------------------- */

    if (status == asyncStatus.INITIAL || status == asyncStatus.LOADING) {
        consoleDebug('------------ loading transactions 🔃 --------------')
        return (
            <div className="transactions-list-container skeleton">
                <div className="list-actions-container skeleton"></div>
                <div className="transactions-table-wrapper skeleton">
                    <div className="transactions-table skeleton">
                        Loading Transactions...
                    </div>
                </div>
            </div>
        )
    }




    /* ----------------------------------- UI ----------------------------------------------------------- */

    const isSelectionActive = selectedItems.size > 0;


    /* ---------- SELECT ALL IGNORES THE QUERY ---------- */
    function toggleSelectAll() {
        if (isSelectionActive) {
            setSelectedItems(new Set());
        }
        else {
            setSelectedItems(new Set(filteredIdList));
        }
    }


    return (
        <>
            <div className="transactions-list-container">

                {/* ---------- scrolling container for < $tablet-width ----------- */}
                <div className="table-wrapper" ref={scrollingParentRef}>

                    <div className="transactions-table" >

                        {/* ------------------------------ TABLE HEADER ------------ */}
                        {
                            !isBelowWidthThreshold && (

                                <header className="table-head">

                                    <li className="table-head-row">

                                        <div className={"table-header-cell select-all-transactions-cell"}>
                                            <span className="select-all-transactions" onClick={toggleSelectAll}>
                                                {
                                                    selectedItems.size == 0 && (<CheckBoxOutlineBlankRounded />)
                                                }
                                                {
                                                    selectedItems.size != 0 && selectedItems.size == filteredIdList.length && (<CheckBoxRounded />)
                                                }
                                                {
                                                    selectedItems.size > 0 && selectedItems.size < filteredIdList.length && (<IndeterminateCheckBoxRounded />)
                                                }
                                            </span>
                                        </div>
                                        {
                                            selectedItems.size == 0 ?
                                                <>
                                                    <div className="table-header-cell amount-cell">Amount</div>
                                                    <div className="table-header-cell tag-cell">Tag</div>
                                                    <div className="table-header-cell title-cell">Title</div>
                                                    <div className="table-header-cell date-cell">Date</div>
                                                </> :
                                                <>
                                                    <div className="selected-transactions-action-cell">

                                                        <span className="transaction-selection-action" onClick={openDeleteListModal}>
                                                            <DeleteOutline />
                                                            Delete
                                                        </span>
                                                    </div>

                                                    <div className="selected-transactions-action-cell">
                                                        <span className="transaction-selection-action" onClick={openExportListModal}>
                                                            <UploadFileOutlined /> Export
                                                        </span>
                                                    </div>

                                                </>
                                        }
                                    </li>
                                </header>
                            )
                        }


                        {
                            isBelowWidthThreshold && (

                                <header className="table-head">

                                    <li className="table-head-row list-actions-row">

                                        {/* ------- SELECT-ALL ------- */}
                                        <div className="select-all-transactions-cell">
                                            <span className="select-all-transactions" onClick={toggleSelectAll}>
                                                {
                                                    selectedItems.size == 0 && (<CheckBoxOutlineBlankRounded />)
                                                }
                                                {
                                                    selectedItems.size != 0 && selectedItems.size == filteredIdList.length && (<CheckBoxRounded />)
                                                }
                                                {
                                                    selectedItems.size > 0 && selectedItems.size < filteredIdList.length && (<IndeterminateCheckBoxRounded />)
                                                }
                                            </span>
                                        </div>

                                        {/* ------ EDIT ::selected (1) -------- */}
                                        {
                                            selectedItems.size == 1 && (
                                                <div className="selected-transactions-action-cell">
                                                    <span className="transaction-selection-action">
                                                        <EditOutlined />
                                                        Edit
                                                    </span>
                                                </div>
                                            )
                                        }

                                        {/* -------- DELETE, EXPORT ::selected (any) ------- */}
                                        {
                                            selectedItems.size > 0 && (

                                                <>
                                                    <div className="selected-transactions-action-cell">
                                                        <span className="transaction-selection-action" onClick={openDeleteListModal}>
                                                            <DeleteOutline />
                                                            Delete
                                                        </span>
                                                    </div>

                                                    <div className="selected-transactions-action-cell">
                                                        <span className="transaction-selection-action" onClick={openExportListModal}>
                                                            <UploadFileOutlined />
                                                            Export
                                                        </span>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </li>
                                </header>                                
                            )
                        }                        


                        {/* -------------------------------- TABLE BODY ------------- p*/}

                        {/* --------- scrolling parent for > 824px [default] ------------ */}
                        <div className="table-body-wrapper">

                            <ul className="table-body">
                                {
                                    sortedList.map(id => (
                                        <TransactionListItem
                                            key={id}
                                            id={id}
                                            data={byId[id]}
                                            isSelected={selectedItems.has(id)}
                                            toggleSelect={toggleSelectTransaction}
                                            toggleShiftSelectHandler={toggleShiftSelectHandler}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            isBelowWidthThreshold={isBelowWidthThreshold}
                                        />
                                    ))
                                }
                            </ul>
                        </div>

                    </div>

                </div>

            </div>

            {/* ------------------- MODALS ----------------------- */}

            <ModalWrapper ref={deleteListRef}>
                <DeleteSelectedModal
                    selectedTransactionsList={Array.from(selectedItems).map(id => ({ id: id, data: byId[id] }))}
                    onDeleteList={onDeleteList}
                    callbackModifyUI={clearSelection}
                />
            </ModalWrapper>

            <ModalWrapper ref={exportListRef}>
                <ExportSelectedModal 
                    transactionsList={Array.from(selectedItems).map(id => ({ id: id, data: byId[id] }))}
                />
            </ModalWrapper>
        </>
    )

}