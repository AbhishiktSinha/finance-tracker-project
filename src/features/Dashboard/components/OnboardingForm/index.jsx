import { useContext, useMemo, useRef } from 'react'

import {Form, Button, Input, Select} from 'antd'
import currencyToSymbolMap from 'currency-symbol-map/map'

import ActionButton from '../../../../components_common/ActionButton';
import privateContext from '../../../PrivateLayout/context';
import { FirestoreCRUD } from '../../../../firebase/firestore';

import './styles.css'
import { consoleError } from '../../../../console_styles';

export default function OnboardingForm({modalRef}) {
    
    const saveButtonRef = useRef();
    const {user: {uid}} = useContext(privateContext)

    const options = useMemo(()=>{
        return Object.keys(currencyToSymbolMap).map(code => {
            return {
                label: code, 
                value: code
            }
        })
    }, [])

    async function onFinish(values) {

        const {defaultCurrency, balance} = values;

        saveButtonRef.current.setButtonLoading();
        
        try {
            await new FirestoreCRUD()
                .updateDocData(
                    `users/${uid}`,
                    {
                        'balance': balance,
                        'settings.defaultCurrency': defaultCurrency
                    }
                )
            modalRef.current.closeModal();            
        }
        catch(e) {
            consoleError(e.message);
            saveButtonRef.current.setButtonActive();

        }
    }
    

    return (
        <Form 
            onFinish={onFinish}
            layout='vertical'
            title='Preliminary Details'
            initialValues={{
                balance: 0,
            }}
        >
            <div className="form-header">
                <h2>Just One More Step</h2>
                <p>before you get started</p>
            </div>
            <Form.Item
                rules={[
                    {required: true, message:'Please select the default currency'}
                ]}
                name={'defaultCurrency'}
                label={'Default Currency'}
                key={'currency'}
            >
                <Select 
                    showSearch
                    placeholder={'CURRENCY'}
                    optionFilterProp='label'
                    options={options}
                />
            </Form.Item>

            <Form.Item
                rules={[
                    {required: true, message: 'Please enter the initial amount (minimum 0)'},
                    {pattern: /^\d+$/, message: 'Please enter a valid amount (wihtout commas)'}
                ]}
                name={'balance'}
                label={'Initial Balance'}
            >
                <Input placeholder='Initial Balance' />
            </Form.Item>

            <Form.Item>
                <ActionButton
                    type='primary'
                    htmlType='submit'
                    ref={saveButtonRef}
                >
                    Save
                </ActionButton>                
            </Form.Item>

        </Form>
    )
}