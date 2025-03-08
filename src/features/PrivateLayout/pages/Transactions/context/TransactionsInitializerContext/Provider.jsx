import { useDispatch, useSelector } from "react-redux";
import { selectPrimaryTransactionsList } from "../../../../redux/selectors";
import { asyncStatus, timeframe } from "../../../../../../enums";
import { useContext, useEffect, useMemo, useState } from "react";
import FilterConditionsContext from "../FilterConditionsContext";
import { FirestoreCRUD } from "../../../../../../firebase/firestore";
import userAuthContext from "../../../../context/userAuthContext";
import { consoleDebug, consoleError, consoleInfo } from "../../../../../../console_styles";
import TransactionsInitializerContext from ".";
import { deleteTransactionsListThunk } from "../../../../redux/thunk";


export default function TransationsInitializerContextProvider({children}) {

    const dispatch = useDispatch();

    const {user: {uid}} = useContext(userAuthContext)

    const {appliedFilters, filterOptions} = useContext(FilterConditionsContext);

    const primaryTransactionsSlice = useSelector( ({primaryTransactions})=>primaryTransactions);

    const [customTransactionsSlice, setCustomTransactionsSlice] = useState({
        timeframe: null,
        status: asyncStatus.INITIAL, 
        data: undefined, 
        error: '', 
    })

    
    const isCustomSelected = ()=>{
        const appliedTimeframeKey = Array.from(appliedFilters.timeframe)[0]; //set with single value

        console.log(appliedTimeframeKey);
        
        return ( filterOptions.timeframe[appliedTimeframeKey] == filterOptions.timeframe.CUSTOM);
    }



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

    /**## deleteTransactions
     * Function that takes a set of Ids of target transactions,  
     * and deletes them from firestore and application state
     * 
     * @param {Set<string>} targetTransactionsSet set of ids of transactions to be deleted
     */
    async function deleteTransactions(targetTransactionsSet) {
        
        const deleteCustomTransactions = ()=>{

            // if custom transactions exist
            if (Boolean(getCustomTimeframe()) && customTransactionsSlice.status == asyncStatus.SUCCESS) {
                
                setCustomTransactionsSlice(state => ({
                    ...state, 
                    data: state.data?.filter( ({id}) => !targetTransactionsSet.has(id) ) || undefined
                }))
            }
        }

        // create list of selected transaction objects, depending on source, from set
        const selectedTransactionsList = isCustomSelected() ?
            customTransactionsSlice.data.filter(({ id }) => targetTransactionsSet.has(id)) :
            primaryTransactionsSlice.data.filter(({ id }) => targetTransactionsSet.has(id));

        await dispatch(
            deleteTransactionsListThunk(
                uid, 
                selectedTransactions, 
                deleteCustomTransactions
            )
        )
    }


    consoleDebug('-------------- CUSTOM TRANSACTIONS CONTEXT ---------  ⤵')
    console.log(customTransactionsSlice);
    consoleDebug('-------------- isCustomTimeframeSelected() ---------  ⤵')
    console.log(isCustomSelected());

    
    /* ------- fetch customTransactions data 
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
    
                const customTimeframeList = await new FirestoreCRUD().getDocsData(
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
                    data: customTimeframeList, 
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
            setCustomTimeframe: setCustomTimeframe, 
            getCustomTimeframe: getCustomTimeframe
        }} >
            {children}
        </TransactionsInitializerContext.Provider>
    )

}