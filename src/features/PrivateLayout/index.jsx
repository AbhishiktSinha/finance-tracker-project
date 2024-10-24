import { Outlet, Navigate } from "react-router-dom";

import { useIsLoggedIn } from "../../custom_hooks";
import Header from "../../components_common/Header";

import userAuthContext from "./context/userAuthContext";

import StateInitializer from "./components/StateInitializer";
import OnboardingAction from "./components/OnboardingAction";
import { Spin } from "antd";
import { asyncStatus } from "../../enums";
import ExchangeRateStatusContext from "./components/ExchangeRateStatusContext";

export default function PrivateContextProviderLayout() {

    const { status, data: user, error } = useIsLoggedIn();

    // user is not signed in
    if ( status == asyncStatus.ERROR ) {
        return <Navigate to={'../auth.financly/login'}/>
    }

    else {
        return (
            <userAuthContext.Provider value={{user}}>
                                
                <div id="app-container">
                    <div className="app-page">

                        <Header
                            userAuthDetails={{status, user, error}}
                        />

                        <div className="main">
                            {
                                (status == asyncStatus.INITIAL || status == asyncStatus.LOADING) ? 
                                (
                                    <h2>{`<PrivateContextProviderLayout />:`}<Spin/></h2>
                                ) : 
                                (

                                    <StateInitializer>
                                        <OnboardingAction>
                                            <ExchangeRateStatusContext>

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
