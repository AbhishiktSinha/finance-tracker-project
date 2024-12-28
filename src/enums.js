export const timeframe = Object.freeze({
    WEEK: 'week', 
    MONTH: 'month',
    YEAR: 'year',
    
    DAYS_7: '7d', 
    DAYS_15: '15d',
    DAYS_30: '30d',
    MONTHS_3: '3m', 
    MONTHS_6: '6m', 
    YEAR_1: '1y',

})

export const transactionType = Object.freeze({
    INCOME: 'income',
    EXPENDITURE: 'expenditure',
    ALL: 'all',
})

/**
 * Providing predefined status values for any Asynchronous Operation
 */
export const asyncStatus = Object.freeze({
    INITIAL: 'initial',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
})

export const changeType = Object.freeze({
    POSITIVE: 'positive', 
    NEGATIVE: 'negative', 
    NONE: 'none'
})

export const dayJsUnits = Object.freeze({
    DAY: 'day', 
    MONTH: 'month', 
    YEAR: 'year', 
    QUARTER: 'quarter',
    WEEK: 'week', 
    HOUR: 'hour', 
    MINUTE: 'minute', 
    SECOND: 'second',
    MILLISECOND: 'millisecond'
})

export const balanceActions = Object.freeze({
    ADD_AMOUNT: 'add_amount', 
    SUBTRACT_AMOUNT: 'subtract_amouut',
    CREATE_AMOUNT: 'create_amount'
})