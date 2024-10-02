import { createSelector } from "reselect";

const selectTransactions = ({userDoc}) => userDoc.data?.transactions;

export const selectOptionalTransactions = createSelector(selectTransactions, (transactions)=>{

    return {
        transactions: transactions? transactions: null,
    }
})