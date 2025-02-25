export const timeframe = Object.freeze({
    WEEK: 'week', 
    MONTH: 'month',
    YEAR: 'year',

    WEEK_DURATION: 'week_d', 
    MONTH_DURATION: 'month_d', 
    YEAR_DURATION: 'year_d',

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

export const balanceOperations = Object.freeze({
    ADD_AMOUNT: 'add_amount', 
    SUBTRACT_AMOUNT: 'subtract_amouut',
    CREATE_AMOUNT: 'create_amount'
})

export const transactionOperations = Object.freeze({
    MODIFICATION: 'modification', 
    CREATION: 'creation', 
    DELETION: 'deletion',
})