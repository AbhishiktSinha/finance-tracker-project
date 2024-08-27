/**
 * FUNCTION THAT PROVIDES IMPLEMENTAION OF GENERIC CRUD OPERATIONS 
 * IN FIRESTORE
 *
 * TODO: 
 * provide definitions for necessary functions
 */
import { db } from ".";

import { doc, setDoc, addDoc, getDoc, collection, updateDoc, onSnapshot } from "firebase/firestore";

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
}