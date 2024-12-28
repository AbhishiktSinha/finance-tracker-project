import latestTransactionContext from "./context"

export default function LatestTransactionContextWrapper({children}) {

    const [latestTransactionDetails, setLatestTransactionDetails] = useState({
        isModified: undefined, 
        modifiedFields: undefined, 
        transaction: undefined,
    })

    function setIsModified(isModified) {
        setLatestTransactionDetails({
            ...latestTransactionDetails, 
            isModified: isModified
        })
    }

    function setModifiedFields(modifiedFields) {
        setLatestTransactionDetails({
            ...latestTransactionDetails, 
            modifiedFields: modifiedFields
        })
    }

    function setTransaction(transaction) {
        setLatestTransactionDetails({
            ...latestTransactionDetails, 
            transaction: transaction
        })
    }

    return (
        <latestTransactionContext.Provider 
            value={{
                latestTransaction:latestTransactionDetails, 
                setIsModified: setIsModified, 
                setModifiedFields: setModifiedFields, 
                setTransaction: setTransaction
            }}
        >
            {children}
        </latestTransactionContext.Provider>
    )
}