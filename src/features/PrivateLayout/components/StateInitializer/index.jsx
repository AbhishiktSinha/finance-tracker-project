import { useContext, useEffect } from "react";

import { useDispatch } from "react-redux";

import privateContext from "../../context";
import statusContext from "./context";

import { stateInitializerThunk } from "../../redux/thunk";

import { DayJSUtils } from "../../../../dayjs";
import { asyncStatus } from "../../../../enums";


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
export default function StateInitializerProvider({children}) {

    const {user} = useContext(privateContext)

    // const status = useSelector(({userDoc})=>userDoc.status);

    // SYNTHETIC STATUS
    const [status, setStatus] = useState(asyncStatus.INITIAL) 
    const dispatch = useDispatch();

    /* useEffect(()=>{

        // fetch userDOC from firestore post initial render
        if (status == 'initial') {
            consoleDebug('FETH_DATA_REQUEST from StateInitializer')
            dispatch(fetchUserDocThunk(user.uid));
        }

    }, [status]) */

    // POST INITIAL-RENDER --> FETCH DATA
    useEffect(()=>{
        if (Boolean(user)) {

            (async ()=>{
                try {
                    setStatus(asyncStatus.LOADING);
                    await dispatch(stateInitializerThunk(user.uid))
    
                    // on successful load, initialize the login timestamp
                    DayJSUtils.setLoginTimestamp();
    
                    setStatus(asyncStatus.SUCCESS);
                }
                catch(e) {
                    setStatus(asyncStatus.ERROR);
                }
    
            })()
        }
    }, [])

    return (
        <statusContext.Provider
            value={{status: status}}
        >
            {children}
        </statusContext.Provider>
    )
}