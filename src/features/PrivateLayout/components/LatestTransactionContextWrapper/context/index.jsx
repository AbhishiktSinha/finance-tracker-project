import {createContext} from 'react'

const latestTransactionContext = createContext({
    isModified: false, 
    modifiedFields: undefined, 
    transaction: undefined
})

export default latestTransactionContext;