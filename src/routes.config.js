
const ROUTES= {

    main: {
        __route__: '/', 
        __index__: '/dashboard', 

        dashboard: '/dashboard', 
        transactions: '/transactions', 

        /* EMPTY CATEGORY LAYOUT ---> doesn't need a specific route */
        analytics: {
            
            /* __index__: '/analytics/balance',  */
            
            emptyCategoryLayout: true,
            
            balance: '/analytics/balance', 
            income: '/analytics/income', 
            expenditure: '/analytics/expenditure'
        }, 
        
        /* EMPTY LAYOUT ---> doesn't need a specific route */
        settings: {            
            /* __index__: '/settings/general',  */

            emptyCategoryLayout: true, 

            general: '/settings/general', 
            account: '/settings/account',
            preferencs: '/settings/preferences',
            imports: '/settings/imports'            
        }

    }, 

    auth: {
        __route__: '/auth.financely', 
        __index__: '/auth.financely/login',

        login: '/auth.financely/login', 
        signup: '/auth.financely/signup',
        
    }
}

export default ROUTES;