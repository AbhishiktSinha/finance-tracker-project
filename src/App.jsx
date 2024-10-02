import { Routes, Route } from "react-router-dom";

import SignupLogin from "./features/SignupLogin";
import Dashboard from './features/PrivateLayout/pages/Dashboard'
import PrivateLayout from './features/PrivateLayout'
import SignupForm from "./features/SignupLogin/components/SignupForm";

import LoginForm from "./features/SignupLogin/components/LoginForm";
import Settings from "./features/PrivateLayout/pages/Settings";
import Balance from "./features/PrivateLayout/pages/Balance";
import Transactions from "./features/PrivateLayout/pages/Transactions";
import Budget from "./features/PrivateLayout/pages/Budget";

import './App.css'

export default function App() {

    return (
        <Routes>
            <Route path="/auth.financly" element={ <SignupLogin /> }>
                <Route path="signup" element={<SignupForm/> }/>                
                <Route path="login" element={<LoginForm/> }/>                
            </Route>

            <Route path="/" element={<PrivateLayout/>} >
                
                <Route path="" element={<Dashboard/>}/>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path='settings' element={<Settings />}/>
                <Route path='balance' element={<Balance />}/>
                <Route path='transactions' element={<Transactions />}/>
                <Route path='budget' element={<Budget />}/>
            </Route>
        </Routes>
    )
}