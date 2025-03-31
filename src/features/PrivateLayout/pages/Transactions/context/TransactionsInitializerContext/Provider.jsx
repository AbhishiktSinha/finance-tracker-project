import { useDispatch, useSelector } from "react-redux";
// import { selectPrimaryTransactionsList } from "../../../../redux/selectors";
import { asyncStatus, timeframe } from "../../../../../../enums";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import FilterConditionsContext from "../FilterConditionsContext";
import { FirestoreCRUD } from "../../../../../../firebase/firestore";
import userAuthContext from "../../../../context/userAuthContext";
import { consoleDebug, consoleError, consoleInfo } from "../../../../../../console_styles";
import TransactionsInitializerContext from ".";
import { deleteTransactionsListThunk } from "../../../../redux/thunk";
import { reduxSliceKeys } from "../../../../defaults";
import { DayJSUtils } from "../../../../../../dayjs";
import merge from 'lodash/merge'


export default function TransationsInitializerContextProvider({children}) {

    const dispatch = useDispatch();

    const {user: {uid}} = useContext(userAuthContext)

    const {appliedFilters, filterOptions} = useContext(FilterConditionsContext);

    const primaryTransactionsSlice = useSelector( ({[reduxSliceKeys.primaryTransactions]:state})=>state);

    const [customTransactionsSlice, setCustomTransactionsSlice] = useState({
        timeframe: null,
        status: asyncStatus.INITIAL, 
        data: {
            byId: {}, 
            allIds: []
        },
        error: '', 
    })

    
    const isCustomSelected = ()=>{
        const appliedTimeframeKey = Array.from(appliedFilters.timeframe)[0]; //set with single value        
        
        return ( filterOptions.timeframe[appliedTimeframeKey] == filterOptions.timeframe.CUSTOM);
    }


    const customTransactionsExist = Boolean(customTransactionsSlice.status == asyncStatus.SUCCESS);

    /* const isValidCustomTransaction = (occurredAt)=>{
        if (customTransactionsExist) {

            const {start, end} = customTransactionsSlice.timeframe;

            return (occurredAt >= start && occurredAt <= end);
        }
    } */
    const isValidCustomTransaction = useCallback((occurredAt)=>{
        if (customTransactionsExist) {

            const {start, end} = customTransactionsSlice.timeframe;

            return (occurredAt >= start && occurredAt <= end);
        }
    }, [customTransactionsExist])



    /**
     * 
     * @param {number} start start-timestamp
     * @param {number} end end-timestamp
     */
    function setCustomTimeframe(start, end) {
        // custom timeframe does not exist
        if (!Boolean(customTransactionsSlice.timeframe)) {

            setCustomTransactionsSlice(state => ({
                ...state, 
                timeframe: {start: start, end: end}, 
                status: asyncStatus.INITIAL, // to signify fetching of data for this timeframe
            }))
        }
        else {

            const {start: prevStart, end:prevEnd} = customTransactionsSlice.timeframe

            // same range
            if (prevStart == start && prevEnd == end) return;

            else {
                setCustomTransactionsSlice(state => ({
                    ...state, 
                    timeframe: {start: start, end: end}, 
                    status: asyncStatus.INITIAL, // fetch for this timeframe range
                }))
            }
        }
    }

    /**
     * 
     * @returns {{start:number, end:number} | undefined} customTimeframe
     */
    function getCustomTimeframe() {
        return customTransactionsSlice.timeframe;
    }

    /* ----------- FAUX ACTION-REDUCERS -------- */

    /**## onCreate
     * Faux action function that handles the conditional creation of a customTransaction
     * 
     * @param {string} id transaction id
     * @param {object} data transaction data obejct
     */
    function onCreate({id, data}) {

        if (customTransactionsExist && isValidCustomTransaction(data.timestamp.occurredAt)) {

            setCustomTransactionsSlice(state => ({
                ...state, 
                data: {
                    byId: {
                        ...state.data.byId, 
                        [id]: data
                    }, 
                    allIds: [...state.data.allIds, id]
                }
            }))
        }
    }
    
    /**## onDelete
     * Faux action function to handle the conditional delete of a customTransaction
     * 
     * @param {string} id transaction id
     * @param {object} data transaction data object
     */
    const onDelete = useCallback(({id, data})=>{
        // if custom transactions exist

        consoleDebug('----------- DELETE CUSTOM TRANSACTIONS INVOKED -------------');

        if (customTransactionsExist) {

            setCustomTransactionsSlice(state => {
                
                const new_byId = {...state.data.byId};
                delete new_byId[id];

                consoleDebug(`------- DELETING TRANSACTION: ${id} :: ${state.data.byId[id].title}`);
                console.log(new_byId);

                return {
                    ...state, 
                    data: {
                        byId: new_byId, 
                        allIds: state.data.allIds.filter( transactionId => (transactionId != id))
                    }
                }

            })
        }
    }, [customTransactionsExist])

    
    /**
     * 
     * @param {string} id transaction id
     * @param {object} data transaction data
     * @param {object} modifiedData modified data of the transaction as an object
     */
    const onEdit = useCallback(({id, data, modifiedData})=>{

        consoleDebug('---------- CUSTOM TRANSACTION EDIT INVOKED -----------')
        console.log(id, data, modifiedData);
        // if custom transactions exist
        if (customTransactionsExist) {

            const {timestamp: {occurredAt: prev_occurredAt}} = data;
            const new_occurredAt = modifiedData.timestamp?.occurredAt || prev_occurredAt;

            /* ---------- THREE CASES OF MODIFICATION ---------- */

            // CASE 1: used to be CT -- is NOT anymore
            if ( isValidCustomTransaction(prev_occurredAt) && !isValidCustomTransaction(new_occurredAt) ) {
                consoleDebug('CUSTOM TRANSACTION EDIT ------- no more CT')
                onDelete(id, data);
            }
            
            // CASE 2: used to be CT -- still IS ---- modified in situ
            else if ( isValidCustomTransaction(prev_occurredAt) && isValidCustomTransaction(new_occurredAt)) {
                
                consoleDebug('CUSTOM TRANSACTION EDIT ------- in situ modification')
                
                setCustomTransactionsSlice(state => {
                    const transactionData = state.data.byId[id];
                    const newData = merge({}, transactionData, modifiedData);

                    console.log('Custom Transaction Previous Data:',transactionData);
                    console.log('Custom Transaction New Data:', newData);

                    return {
                        ...state, 
                        data: {
                            ...state.data, 
                            
                            byId: {
                                ...state.data.byId, 
                                
                                [id]: merge({}, state.data.byId[id], modifiedData)
                            }
                        }
                    }
                })
            }
            
            // CASE 3: NOT used to be CT ---- IS now
            else if ( !isValidCustomTransaction(prev_occurredAt) && isValidCustomTransaction(new_occurredAt)) {
                
                consoleDebug('CUSTOM TRANSACTION EDIT ------- new CT to be created')
                onCreate(id, data);
            }
        }
    }, [customTransactionsExist, isValidCustomTransaction])



    /**## onDeleteList
     * Faux action function that deletes the transactions  
     * corresponding to the set of ids provided as the sole argument
     * 
     * @param {Set} targetTransactionsSet 
     */
    const onDeleteList = useCallback((targetTransactionsSet)=>{

        if (customTransactionsExist) {
            
            setCustomTransactionsSlice(state => {

                const new_byId = Object.fromEntries(
                    Object.entries(state.data.byId).filter(
                        ([id,data])=>!targetTransactionsSet.has(id)
                    )
                )

                return {
                    ...state, 
                    data: {
                        byId: new_byId, 
                        allIds: state.data.allIds.filter(id => !targetTransactionsSet.has(id))
                    }
                }
            })
        }
    }, [customTransactionsExist, setCustomTransactionsSlice])

    // #region DEBUG LOGS
    consoleDebug('-------------- CUSTOM TRANSACTIONS CONTEXT ---------  ⤵')
    console.log(customTransactionsSlice);
    consoleDebug('-------------- isCustomTimeframeSelected() ---------  ⤵')
    console.log(isCustomSelected());
    // #endregion

    
    /* ------- fetch customTransactions data ------------
        every-time the custom timeframe changes -----  */
    useEffect(()=>{

        (async ()=>{
            // fetch when customTimeframe exists and is selected
        // and data is not fetched yet
        
        if (Boolean(getCustomTimeframe()) && 
        isCustomSelected() && 
        customTransactionsSlice.status == asyncStatus.INITIAL) {

            consoleDebug(`------ FETCHING CUSTOM TRANSACTIONS: ${getCustomTimeframe().start} TO ${getCustomTimeframe().end} -------------------`);

            setCustomTransactionsSlice(state => ({
                ...state, 
                status: asyncStatus.LOADING, 
            }))
    
            try {
    
                const customTransactionsData = await new FirestoreCRUD().getDocsData(
                    `users/${uid}/transactions`, 
                    [
                        {
                            key: 'timestamp.occurredAt', 
                            relationship: '>=', 
                            value: customTransactionsSlice.timeframe.start
                        }, 
                        {
                            key: 'timestamp.occurredAt', 
                            relationship: '<=', 
                            value: customTransactionsSlice.timeframe.end
                        }
                    ]
                )
    
                setCustomTransactionsSlice(state => ({
                    ...state, 
                    status: asyncStatus.SUCCESS, 
                    data: {
                        byId: customTransactionsData, 
                        allIds: Object.keys(customTransactionsData)
                    }, 
                    error: '',
                }))
            }
            catch(e){ 
                consoleError(e);
                console.log(e);
                setCustomTransactionsSlice(state => ({
                    ...state, 
                    status: asyncStatus.ERROR, 
                    error: e
                }))
            }
            
        }

        })()

    }, [customTransactionsSlice.timeframe, isCustomSelected()])


    /* --------------- return JSX ------------------- */

    const selectedTransactions = isCustomSelected() ? customTransactionsSlice : primaryTransactionsSlice;

    return (
        <TransactionsInitializerContext.Provider value={{
            transactionsInitializer: selectedTransactions, 
            setCustomTimeframe, getCustomTimeframe, 
            onCreate, onDelete, onEdit, onDeleteList
        }} >
            {children}
        </TransactionsInitializerContext.Provider>
    )

}