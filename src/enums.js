export const timeframe = Object.freeze({
    WEEK: 'week', 
    MONTH: 'month',
    YEAR: 'year',
})

export const transactionType = Object.freeze({
    INCOME: 'income',
    EXPENDITURE: 'expenditure',
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