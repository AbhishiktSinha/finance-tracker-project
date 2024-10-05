import { auth, provider } from ".";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";

import { FirestoreCRUD } from "./firestore";

import { consoleSucess, consoleError } from "../console_styles";

export class FirebaseSignUp {
    
    constructor() {}

    /**
     * Sign up user with Email and Password
     */
    async emailAndPassword( {first_name, last_name, email, password} ) {
        
        try {
            // create account with email and password
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )            
            const { user, user: {uid} } = userCredentials;

            await updateProfile(user, {
                displayName: first_name + (Boolean(last_name) ? (' ' + last_name) : '')
            }) 

            consoleSucess("SUCCESS:\nSigned up with email & password");            
            
            // store all the data in a new document
            new FirestoreCRUD().setDocData(
                `users/${uid}`,
                {
                    first_name,
                    ...(last_name ? {last_name}: {}),
                    email,
                    password
                }
            )
            
            return { success: true, message: 'Sign-up Successful' }
        }
        catch (error) {
            const { code, message } = error;
            return {
                success: false,
                message: error.message
            }
        }
    }    
}

export class FirebaseLogin {
    constructor() {}

    /**
     * Login with Email and Password
     */
    async emailAndPassword( {email, password}) {

        try {
            // create account with email and password
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )            
            const { user: {uid} } = userCredentials;

            consoleSucess("SUCCESS:\nLogged in with email & password");
                    
            
            return { success: true, message: 'Log in Successful' }
        }
        catch (error) {
            const { code, message } = error;
            return {
                success: false,
                message: message
            }
        }
    }
}

export const logOutUser = () => {

    signOut(auth)
        .then(() => {
            consoleSucess('Sign-out Successful')            
        })
        .catch((error) => {
            consoleError('Sign-out Unsuccessful')
        })
}
