import statusContext from "./context";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDocThunk } from "../../redux/thunk";


/**
 * Utility Component StateInitializer
 * 
 * This component checks for the presence of valid data in the application state
 * 
 * If data is not found (status == initial) the it triggers relevant api call and populates the 
 * application state on success.
 * 
 * This avoids the necessity for the individual private Route components to 
 * check the status of the application state, and ensures that all the child private Route Components
 * receive access to the status of the app state, to display the relevant UI, and also ensures that
 * regardless of which private route is hit initially, it recieves complete app state.
 */
export default function StateInitializer({children}) {

    const status = useSelector(({userDoc})=>userDoc.status);
    const dispatch = useDispatch();

    useEffect(()=>{

        // fetch userDOC from firestore post initial render
        if (status == 'initial') {
            dispatch(fetchUserDocThunk(user.uid));
        }
        // check necessity of onborading modal on success

    }, [status])

    return (
        <statusContext.Provider
            value={{status: status}}
        >
            {children}
        </statusContext.Provider>
    )
}