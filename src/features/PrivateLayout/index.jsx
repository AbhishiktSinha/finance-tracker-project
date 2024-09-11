import { Outlet, Navigate } from "react-router-dom";

import { useIsLoggedIn } from "../../custom_hooks";
import Header from "../../components_common/Header";

import privateContext from './context'

export default function PrivateLayout() {

    const { authStatus, user } = useIsLoggedIn();

    // user is not signed in
    if ( authStatus == 'false' ) {
        return <Navigate to={'../auth.financly/login'}/>
    }
    else {
        return (
            <privateContext.Provider value={{user}}>

                {
                    /*
                    <div id="app-container">
                        {authStatus=='loading' && (
                            <h2>Loading...</h2>
                        )}
                        {
                            authStatus=='true' && (
                                <div className="app-page">
                                    <Header
                                        userDetails={user}
                                    />
    
                                    <div className="main">
                                        <Outlet />
                                    </div>
                                </div>                        
                            )
                        }
                    </div> 
                    */
                }
                
                {/* FIXME: StateInitializer component to fetch app state common for all private routes */}
                <div id="app-container">
                    <div className="app-page">

                        <Header
                            userAuthDetails={authStatus == 'loading' ? 'loading' : user}
                        />

                        <div className="main">
                            {
                                authStatus == 'loading' ? 
                                (
                                    <h2>Loading...</h2>
                                ) : (

                                    <Outlet />
                                )
                            }
                        </div>
                    </div>
                </div>

            </privateContext.Provider>
        )
    }
}