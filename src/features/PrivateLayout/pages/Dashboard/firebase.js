import { FirestoreCRUD } from "../../../../firebase/firestore"

export const getUserDoc = async(uid)=>{

    return new FirestoreCRUD().getDocData(`users/${uid}`);
}