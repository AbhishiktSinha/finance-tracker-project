import { timeframe } from "../../enums";

const defaults = Object.freeze({

    primaryTransactionsTimeframe: timeframe.YEAR_DURATION,
    app_routes: [
        {
            title: 'Dashboard', 
            matchingRoutes: ['', 'dashboard'], 
            targetRoute: '/dashboard'
        }, 
        {
            title: 'Transactions', 
            matchingRoutes: ['transactions'], 
            targetRoute: '/transactions'
        }, 
        {
            title: 'Balance', 
            matchingRoutes: ['analytics/balance'], 
            targetRoute: '/analytics/balance'
        }, 
        {
            title: 'Income', 
            matchingRoutes: ['analytics/income'], 
            targetRoute: '/analytics/income'
        }, 
        {
            title: 'Expenditure', 
            matchingRoutes: ['analytics/expenditure'], 
            targetRoute: '/analytics/expenditure'
        }, 
        {
            title: 'Settings', 
            matchingRoutes: ['settings'], 
            targetRoute: '/settings'
        }
    ]
})

export default defaults;