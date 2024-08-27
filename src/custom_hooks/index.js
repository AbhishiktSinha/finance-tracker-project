import { useState, useEffect, useCallback } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleError, consoleInfo } from "../console_styles";

/**
 * useIsLoggedIn hook that returns an array 
 * 
 * useIsLoggedIn() -> [boolean: isLoggedIn, function: logOut]
 * 
 */
function useIsLoggedIn() {

    // state: loading | true | false
    // user: null | {...}
    const [userData, setUserData] = useState({
        authStatus: 'loading',
        user: null,
    });


    /* Let the state subscribe to change in login status */
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {

            consoleInfo(`onAuthStateChanged : user present : ${Boolean(user)}`);
            if (user) {
                console.log('SIGNED IN USER:', user);
                setUserData({
                    authStatus: 'true',
                    'user': user,
                });
            }
            else {
                setUserData({
                    authStatus: 'false',
                    'user': null
                });
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    return userData;
} 


export {
    useIsLoggedIn,
}