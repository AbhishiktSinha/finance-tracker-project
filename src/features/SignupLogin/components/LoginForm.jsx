import { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Form, Input } from "antd";

import { FirebaseLogin } from "../../../firebase/auth";
import ActionButton from "../../../components_common/ActionButton";

import { consoleError, consoleInfo } from "../../../console_styles";

import '../styles/LoginForm.css';


export default function LoginForm() {

    const buttonRef = useRef();

    const navigate = useNavigate();    
    
    const onFinish = useCallback(async (values)=> {
        console.log(values);

        buttonRef.current.setButtonLoading();
        const {success, message} =  await new FirebaseLogin().emailAndPassword(values) ;
        
        if (success) {
            navigate('../../')
        }
        else {
            buttonRef.current.setButtonActive();
            consoleError(`Error: ${message}`);
        }
    })

    consoleInfo("LogIn form Rendered");

    return (
        <>
            
            <Form
                className="log-in-form auth-form"
                // name="sign-up-form"
                onFinish={onFinish}
                layout="vertical"
            >
                <h2 className="form-title">Log <span>In</span></h2>
                <Form.Item 
                    key={'email'}
                    name={'email'}
                    label="Email"
                    rules={[
                        {required: true, message: "Email is required"},
                        {type:'email', message: 'Pleae enter a valid email'}
                    ]}                    
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    key={'password'}
                    name={'password'}
                    label="Password"
                    rules={[
                        {required: true, message: 'Password is requried'},                        
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item 
                    key={'email-login-button'}
                >
                    <ActionButton 
                        htmlType="submit"
                        type="default"  
                        className="form-button"  
                        ref={buttonRef}
                    >
                        Log In
                    </ActionButton>
                </Form.Item>   

            </Form>
            <div className="auth-form-redirect">New here? <Link to={'../signup'}>Sign up now!</Link></div>
        </>
    )
}