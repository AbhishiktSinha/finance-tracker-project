/**
 * FUNCTION THAT PROVIDES IMPLEMENTAION OF GENERIC CRUD OPERATIONS 
 * IN FIRESTORE
 *
 * TODO: 
 * provide definitions for necessary functions
 */
import { db } from ".";

import { doc, setDoc, addDoc, getDoc, collection, updateDoc, onSnapshot, query, where, getDocs, orderBy, writeBatch, runTransaction } from "firebase/firestore";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";


export class FirestoreCRUD {
    constructor() {

    }

    /**
     * Private Methods: retrieve ref to doc or collection
     */
    #getDocRef(docPath, collectionPath) {
        if (collectionPath) { 
            return doc (this.#getCollectionRef(collectionPath));
        }
        if (typeof docPath  !== 'string') {
            throw new Error('Path must be a string')
        }
        return doc(db, docPath, );
    }
    #getCollectionRef(path) {
        if (typeof path !== 'string') {
            throw new Error('Path must be a string')
        }
        return collection(db, path)
    }

    /**
     * 
     * @param {string} collectionPath 
     * @returns random `id` for a document in this collection
     */
    getRandomDocID(collectionPath) {
        return doc(this.#getCollectionRef(collectionPath)).id;
    }

    /**## setDocData
     * Method that necessarily takes the docPath, and the data and either creates a new doc if the docRef doesn't exists,  
     * or overwrites the existing doc found corresponding to the docRef.  
     * 
     * @param {string} docPath required absolute path to the target firestore document
     * @param {object} data data to create the document with
     * @param {boolean} merge default false | optional argument to specify whether data has to be appended to an existing doc or not
     */
    async setDocData(docPath, data, merge=false) {

        try {

            const docRef = this.#getDocRef(docPath);

            // consoleInfo(`Doc Ref (id): ${docRef.id}`);
            
            const result = await setDoc(docRef, data, {'merge': merge});
            
            consoleSucess('Doc set successfully');

            // return result;
        }
        catch(e) {
            throw e;
        }

    }

    
    /**## createNewDoc
     * Method that implements the **Firestore** `addDoc` function to create a new doc with a random id, 
     * using the provided data, and returns the docRef of the doc so created.
     * 
     * @param {string} collectionPath the absolute path to the targeted collection
     * @param {object} data the data as an object, used to create the new document
     * @returns Promise that fulfils with the docRef of the newly created doc
     */
    async createNewDoc(collectionPath, data) {

        const collectionRef = this.#getCollectionRef(collectionPath);

        return await addDoc(collectionRef, data)
    }


    /**
     * UpdateDocData: -> update a given field of the document
     */
    async updateDocData(docPath, data) {
        const docRef = this.#getDocRef(docPath);
        try {
            const result = await updateDoc(docRef, data);
            
            consoleSucess(`DOC Updated Successfully: ${docPath}`);
        }
        catch(e) {
            throw e;
        }
    }


    /**
     * GetDocData: -> get current data in the document
     */
    async getDocData(docPath) {
        const docRef = this.#getDocRef(docPath);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists) {
            throw new Error('Invalid Document:', docPath)
        }

        return docSnap.data();

    }

    /**  GetDocs --> Query docs from a collection
     * @param {string} collectionPath - absolute path to the collection 
     * @param {Array<object>} queryBuilder<{key, relationship, value}> - array of where objects to build a query
     * @param {Array<object>} order<{key, trend: 'asc' | 'desc'}> - array for ordering the query, default trend is 'asc'
    */
    async getDocsData(collectionPath, queryBuilder = [], order = []) {
        // Get collection reference
        const collectionRef = this.#getCollectionRef(collectionPath);

        // Build where queries from queryBuilder array
        const getQueries = () => {
            return queryBuilder.map(({ key, relationship, value }) => {
                return where(key, relationship, value);
            });
        };

        // Build order conditions from order array
        const getOrder = () => {
            return order.map(({ key, trend }) => {
                return orderBy(key, trend || 'asc'); // Default to 'asc' if trend is not provided
            });
        };

        // Construct the query with dynamic conditions
        const q = query(
            collectionRef,
            ...(queryBuilder.length > 0 ? getQueries() : []),
            ...(order.length > 0 ? getOrder() : [])
        );        

        // Execute the query and get documents
        const querySnapshot = await getDocs(q);

        // Map the snapshot to an array of document data
        /*Firebase treats a nonexistent collection as an empty collection
        Mapping over an empty array gives an empty array */
        return querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                data: doc.data(),
            }
        });
    }


    
    /**
     * GetLiveData: -> subscribe to updates in the document
     */
    getLiveDocData(docPath, snapshotHandler, errorHandler, options) {
        const docRef = this.#getDocRef(docPath);

        return onSnapshot(docRef, 
            options? options: {},
            snapshotHandler,
            errorHandler
        )
    }

    
    /**## batchWrite()  
     * function to perform database operations in a batch  
     * requires the following fields for each operation :  
     * - `operationType`: 'set', 'update', 'delete', 
     * - `docPath`: if the document already exists
     * - `collectionPath`: if the document has to be created with random ref
     * - `data`: the data of the operation
     * - `options`: relevant when we wish to **set** the value for one or more fields of a possibly non existing document
     * 
     * @param {Array<object>} operationsList required fields: operationType, docPath, data | optional fields: options
     * @returns Promise of committing the batch
     */
    async batchWrite(operationsList = []) {

        if (operationsList.length != 0) {

            const batch = writeBatch(db);

            operationsList.forEach( ({operationType='', docPath='', collectionPath='', data={}, options={}}) => {

                let docRef;
                // if no docPath is provided, collection Path will be used to create a random docRef
                if (docPath == '' && collectionPath != '') {
                    
                    docRef = this.#getDocRef(undefined, collectionPath);
                }
                else if (docPath != ''){
                    docRef = this.#getDocRef(docPath);
                }
                else {
                    throw new Error(`Invalid argument for batch write: empty docPath & collectionPath`);
                }
                
                
                switch(operationType) {
                    case 'set' : {
                        batch.set(docRef, data, options);
                        break;
                    }
                    case 'update' : {
                        batch.update(docRef, data,);
                        break;
                    }
                    case 'delete' : {
                        batch.delete(docRef)
                        break;
                    }
                    default : {
                        throw new Error(`batchWriteError\nINVALID OPERATION TYPE: ${operationType}`)
                    }
                }
            })

            return batch.commit()
        }
        else {
            throw new Error("batchWriteError: Invalid Argument 'operationsList'");            
        }

    }


    /**
     * 
     * @param {Array<object>} transactionOperationsList list of { docPathDependencies, transactionConditionFunction }
     * @returns Promise of fullfilled transaction or throws error
     */
    async firestoreTransaction(transactionOperationsList = []) {

        // return the promise of whatever is returned after transaction success

        return runTransaction(db, async (transaction)=>{

            consoleInfo('RUNNING FIRESTORE TRANSACTION');
            console.log(transactionOperationsList);

            const transactionDataList = [];
            
            // READ ------------------- retreive the data from each transactionOperation
            for (const transactionOperation of transactionOperationsList) {


                const { 
                    docPathDependencies, 
                    transactionConditionFunction } = transactionOperation; 

                
                // get the dependency array for the document snapshots
                const docSnapDependencies = await Promise.all(
                    // get the promise of Doc Snap for each docPath
                    docPathDependencies.map( docPath => {
                    
                    const docRef = this.#getDocRef(docPath);
                    return transaction.get(docRef);
                }))

                transactionDataList.push(transactionConditionFunction(docSnapDependencies));
            }

            // CONDITIONAL WRITE ------------------- commit transactions
            for (const transactionData of transactionDataList) {

                const { 
                    commit, 
                    operation, 
                    option, 
                    data, 
                    targetDocPath,
                } = transactionData;

                if (commit) {
    
                    const targetDocRef = this.#getDocRef(targetDocPath);
    
                    switch(operation) {
                        case 'set': {
                            transaction.set(targetDocRef, data, option?option:{});
                            break;
                        }
                        case 'update': {
                            transaction.update(targetDocRef, data)
                            break;
                        }
                        case 'delete': {
                            transaction.delete(targetDocRef)
                            break;
                        }
                        default: {
                            consoleError('Operation not matched for Firestore Transaction');
                            console.log(transactionData)
                            throw `Invalid transaction operation type: ${operation}`
                        }
                    }
                }
                else {
                    consoleError(`transaction for ${targetDocPath} not committed`);
                }
            }

        })
            
    }
    
}