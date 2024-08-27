import { Outlet } from 'react-router-dom'
import Header from '../../components_common/Header'

import './sytles.css'

export default function SignupLogin() {
    
    return (
        <div id="auth_page">
            <Header />
            <div id="main">

                <div className="auth-form-container">
                    {<Outlet />}
                </div>
            </div>
        </div>
    )
}
