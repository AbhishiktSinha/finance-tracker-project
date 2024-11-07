import { useState, useEffect, useCallback, useRef, useMemo, useContext } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";

import { consoleDebug, consoleError, consoleInfo, consoleSucess } from "../console_styles";
import ExchangeRateAPI from "../exchangeRate_api";
import ExchangeRateConvertor from "../exchangeRate_api/convertor";
import { asyncStatus, timeframe as timeframeEnum, transactionType } from "../enums";

import exchangeRateStatusContext from "../features/PrivateLayout/components/ExchangeRateStatusContext/context";
import { FirestoreCRUD } from "../firebase/firestore";
import { DayJSUtils } from "../dayjs";


/**
 * useIsLoggedIn hook that returns an array 
 * 
 * useIsLoggedIn() -> [boolean: isLoggedIn, function: logOut]
 * 
 */
export default function useIsLoggedIn() {

    // state: loading | true | false
    // user: null | {...}
    const [userData, setUserData] = useState({
       status: asyncStatus.INITIAL,
       data: undefined,
       error: ''
    });


    /* Let the state subscribe to change in login status */
    useEffect(() => {

        setUserData({
            ...userData, 
            status: asyncStatus.LOADING,
        })

        const unsubscribe = onAuthStateChanged(auth, (user) => {

            consoleInfo(`onAuthStateChanged : user present : ${Boolean(user)}`);
            if (user) {
                console.log('SIGNED IN USER:', user);
                setUserData({
                    status: asyncStatus.SUCCESS,
                    data: user,
                    error: '',
                });
            }
            else {
                setUserData({
                    status: asyncStatus.ERROR, 
                    data: undefined,
                    error: 'Authentication required'
                });
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    return userData;
} 