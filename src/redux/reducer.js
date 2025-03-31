
import dashboardTransactionsReducer from "../features/PrivateLayout/pages/Dashboard/redux/reducers/dashboardTransactionsReducer";
import balanceReducer from "../features/PrivateLayout/redux/reducers/balanceReducer";
import newTransactionReducer from "../features/PrivateLayout/redux/reducers/newTransactionReducer";
import primaryTransactionsReducer from "../features/PrivateLayout/redux/reducers/primaryTransactionsReducer";
import tagReducer from "../features/PrivateLayout/redux/reducers/tagReducer";
import userDocReducer from "../features/PrivateLayout/redux/reducers/userDocReducer";

import { reduxSliceKeys } from "../features/PrivateLayout/defaults";

const {userDoc, tags, balance, primaryTransactions} = reduxSliceKeys;

const rootReducer = {
    [userDoc]: userDocReducer,
    [tags]: tagReducer,
    [balance]: balanceReducer,
    newTransaction: newTransactionReducer,
    [primaryTransactions]: primaryTransactionsReducer, 
}

export default rootReducer