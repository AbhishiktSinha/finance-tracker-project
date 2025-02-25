import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import SignupLoginLayout from "./features/SignupLoginLayout";
import Dashboard from './features/PrivateLayout/pages/Dashboard'
import PrivateLayout from './features/PrivateLayout'
import SignupForm from "./features/SignupLoginLayout/components/SignupForm";

import LoginForm from "./features/SignupLoginLayout/components/LoginForm";
import Settings from "./features/PrivateLayout/pages/Settings";
import Balance from "./features/PrivateLayout/pages/Balance";
import Transactions from "./features/PrivateLayout/pages/Transactions";
import Budget from "./features/PrivateLayout/pages/Budget";

import ROUTES from "./routes.config";

import './App.scss'
import './ant-override.scss'

export default function App() {

    return (
        <Routes>

            <Route path={ROUTES.auth.__route__} element={<SignupLoginLayout />} >
                <Route index element={<LoginForm />} />
                <Route path={ROUTES.auth.login} element={<LoginForm />} />
                <Route path={ROUTES.auth.signup} element={<SignupForm />} />
            </Route>

            <Route path={ROUTES.main.__route__} element={<PrivateLayout />} >
                <Route index element={<Navigate to={ROUTES.main.__index__} replace/>} />
                <Route path={ROUTES.main.dashboard} element={<Dashboard />}/>
                <Route path={ROUTES.main.transactions} element={<Transactions />}/>

                <Route element={<Outlet />} >
                    <Route index element={<Navigate to={ROUTES.main.analytics.__index__} replace />} />
                    <Route path={ROUTES.main.analytics.balance} element={<h1>analytics/balance</h1>}/>
                    <Route path={ROUTES.main.analytics.income} element={<h1>analytics/income</h1>}/>
                    <Route path={ROUTES.main.analytics.expenditure} element={<h1>analytics/expenditure</h1>}/>
                </Route>
            </Route>
            
            {/* <Route path="/auth.financly" element={ <SignupLoginLayout /> }>
                <Route path="signup" element={<SignupForm/> }/>                
                <Route path="login" element={<LoginForm/> }/>                
            </Route> */}


            {/* <Route path="/" element={<PrivateLayout/>} >
                
                <Route path="" element={<Dashboard/>}/>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path='settings' element={<Settings />}/>
                <Route path='balance' element={<Balance />}/>
                <Route path='transactions' element={<Transactions />}/>
                <Route path='budget' element={<Budget />}/>
            </Route> */}
        </Routes>
    )
}