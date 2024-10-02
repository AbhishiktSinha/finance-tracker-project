import dashboardTransactionsReducer from "../features/PrivateLayout/pages/Dashboard/redux/reducer";
import balanceReducer from "../features/PrivateLayout/redux/reducers/balanceReducer";
import newTransactionReducer from "../features/PrivateLayout/redux/reducers/newTransactionReducer";
import tagReducer from "../features/PrivateLayout/redux/reducers/tagReducer";
import userDocReducer from "../features/PrivateLayout/redux/reducers/userDocReducer";

const rootReducer = {
    userDoc: userDocReducer,
    tags: tagReducer,
    dashboardTransactions: dashboardTransactionsReducer,
    balance: balanceReducer,
    newTransaction: newTransactionReducer,
}

export default rootReducer