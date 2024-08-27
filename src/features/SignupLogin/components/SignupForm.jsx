import { useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Form, Input, Button, Flex } from "antd";

import { consoleError, consoleInfo } from "../../../console_styles";

import '../styles/SignupForm.css';

import { FirebaseSignUp } from "../../../firebase/auth";
import ActionButton from '../../../components_common/ActionButton'

export default function SignupForm() {

    // ref to access ActionButton state handlers
    const buttonRef = useRef();

    const navigate = useNavigate();    
    
    const onFinish = useCallback(async (values)=> {
        console.log(values);

        buttonRef.current.setButtonLoading();
        const {success, message} =  await new FirebaseSignUp().emailAndPassword(values) ;
        
        if (success) {
            navigate('../../')
        }
        else {
            buttonRef.current.setButtonActive();
            consoleError(`Error: ${message}`);
        }
    })

    consoleInfo("SignUp form Rendered");

    return (
        <>
            
            <Form
                className="sign-up-form auth-form"
                // name="sign-up-form"
                onFinish={onFinish}
                layout="vertical"
            >
                <h2 className="form-title">
                    Sign <span>Up</span>
                </h2>
                <div className="form-row">
                    <Flex
                        className="horizontal-flex-container"
                        align="start"
                        justify="space-between"
                        gap={'middle'}
                        flex={[1, 2]}
                    >
                        <Form.Item                            
                            name={'first_name'}
                            label="First Name"
                            key={'first_name'}
                            style={{
                                flex:1
                            }}
                            rules={[
                                { required: true, message: "First name is required" }
                            ]}

                        >
                            <Input></Input>
                        </Form.Item>


                        <Form.Item
                            name={'last_name'}
                            label="Last Name"
                            key={'last_name'}
                            style={{
                                flex: 1.6
                            }}
                        >
                            <Input></Input>
                        </Form.Item>

                    </Flex>
                </div>

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
                    key={'email-signup-button'}
                >
                    <ActionButton 
                        htmlType="submit"
                        type="default"  
                        className="form-button"   
                        ref={buttonRef}                 
                    >
                        Sign Up
                    </ActionButton>                    
                </Form.Item>                
            </Form>
            <div className="auth-form-redirect">Already have an account? <Link to={'../login'}>Log in here.</Link></div>
        </>
    )
}