import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import SignupLogin from "./features/SignupLogin";
import Dashboard from './features/PrivateLayout/pages/Dashboard'
import PrivateLayout from './features/PrivateLayout'
import SignupForm from "./features/SignupLogin/components/SignupForm";


import './App.css'
import LoginForm from "./features/SignupLogin/components/LoginForm";

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
            </Route>
        </Routes>
    )
}