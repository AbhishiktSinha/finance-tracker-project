/**
 * FUNCTION THAT PROVIDES IMPLEMENTAION OF GENERIC CRUD OPERATIONS 
 * IN FIRESTORE
 *
 * TODO: 
 * provide definitions for necessary functions
 */
import { db } from ".";

import { doc, setDoc, addDoc, getDoc, collection, updateDoc, onSnapshot, query, where, getDocs, orderBy, writeBatch } from "firebase/firestore";

import { consoleError, consoleInfo, consoleSucess } from "../console_styles";


export class FirestoreCRUD {
    constructor() {

    }

    /**
     * Private Methods: retrieve ref to doc or collection
     */
    #getDocRef(path) {
        if (typeof path !== 'string') {
            throw new Error('Path must be a string')
        }
        return doc(db, path);
    }
    #getCollectionRef(name) {
        return collection(db, name)
    }

    /**
     * SetDocData: -> to merge or replace contents of existing doc,
     * or create new doc, with given id
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

    /** 
 * GetDocs --> Query docs from a collection
 * @param {collectionPath} string - absolute path to the collection 
 * @param {queryBuilder} Array<{key, relationship, value}> - array of where objects to build a query
 * @param {order} Array<{key, trend: 'asc' | 'desc'}> - array for ordering the query, default trend is 'asc'
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

    
    /**
     * 
     * @param {Array<object>} operationsList required fields: operationType, docPath, data
     * @returns Promise of committing the batch
     */
    async batchWrite(operationsList = []) {

        if (operationsList.length != 0) {

            const batch = writeBatch(db);

            operationsList.forEach( ({operationType='', docPath='', data={}}) => {

                const docRef = this.#getDocRef(docPath);

                switch(operationType) {
                    case 'set' : {
                        batch.set(docRef, data);
                        break;
                    }
                    case 'update' : {
                        batch.update(docRef, data);
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
}