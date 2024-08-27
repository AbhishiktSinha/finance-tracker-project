import { useState, useEffect, useContext } from 'react'

import { FirestoreCRUD } from '../../../../../../firebase/firestore'
import privateContext from '../../../../context';
import userDocContext from '.';
import { consoleDebug, consoleError } from '../../../../../../console_styles';

export default function Provider({children}) {

    const userCredentials = useContext(privateContext);

    const [userDocState, setUserDocState] = useState({
        loading: false,
        data: undefined,
        error: '',
    });

    useEffect(()=>{

        const {uid} = userCredentials;
        
        // fetching data
        setUserDocState({
            ...userDocState,
            loading: true,
        })

        const unsubscribe = new FirestoreCRUD().
            getLiveDocData(
                `users/${uid}`,

                // success callback
                (snapshot)=>{
                    consoleDebug('live snapshot from Dashboard context');
                    console.log(snapshot);

                    setUserDocState({
                        loading: false,
                        data: snapshot.data,
                        error: '',
                    });
                },
                
                // failure callback
                (error)=>{
                    consoleError(error.message);
                    setUserDocState({
                        loading: false,
                        data: undefined,
                        error: error.message,
                    })
                }
            );

        return unsubscribe;

    }, [])

    return (
        <userDocContext.Provider 
            value={userDoc}
        >
            {children}
        </userDocContext.Provider>
    )
}