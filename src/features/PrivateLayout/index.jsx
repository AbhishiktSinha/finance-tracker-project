import { Outlet, Navigate } from "react-router-dom";

// import { useIsLoggedIn } from "../../custom_hooks";
import useIsLoggedIn from "../../custom_hooks/useIsLoggedIn";
import Header from "../../components_common/Header";

import userAuthContext from "./context/userAuthContext";
import ExchangeRateStatusContext from "./components/ExchangeRateStatusContext";

import StateInitializer from "./components/StateInitializer";
import OnboardingAction from "./components/OnboardingAction";
import NavigationDrawer from './components/NavigationDrawer/index.jsx'

import { Spin } from "antd";

import { asyncStatus } from "../../enums";
import { consoleDebug, consoleInfo } from "../../console_styles";

import './styles.scss'
import ROUTES from "../../routes.config.js";
import { useRef } from "react";

export default function PrivateContextProviderLayout() {

    const { status: userLoginStatus, data: user, error } = useIsLoggedIn();

    const navDrawerRef = useRef(null);

    consoleInfo('USER LOGIN STATUS ------- ⤵');
    console.log(userLoginStatus, user, error);  

    // user is not signed in
    if ( userLoginStatus == asyncStatus.ERROR ) {

        consoleDebug(' ------- Navigating to AUTH.FINANCELY --------')
        return <Navigate to={ROUTES.auth.__route__} replace/>
    }

    else {
        return (
            <userAuthContext.Provider value={{user}}>
                                
                <div id="app-container">
                    <div className="app-page">

                        <Header
                            userAuthDetails={{userLoginStatus, user, error}}
                            drawerActionsRef={navDrawerRef}
                        />

                        <div className="main">
                            {
                                (userLoginStatus == asyncStatus.INITIAL || userLoginStatus == asyncStatus.LOADING) ?
                                    (
                                        <h2>{`<PrivateContextProviderLayout />:`}<Spin /></h2>
                                    ) :
                                    (

                                        <StateInitializer>
                                            <OnboardingAction>
                                                <ExchangeRateStatusContext>
                                                    
                                                    <NavigationDrawer ref={navDrawerRef}/>

                                                    <Outlet />
                                                </ExchangeRateStatusContext>
                                            </OnboardingAction>
                                        </StateInitializer>
                                    )
                            }
                        </div>
                    </div>
                </div>

            </userAuthContext.Provider>
        )
    }
}
