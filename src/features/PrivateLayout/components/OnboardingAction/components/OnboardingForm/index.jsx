import { useContext, useMemo, useRef } from 'react'

import {Form, Input, Select} from 'antd'

import ActionButton from '../../../../../../components_common/ActionButton';
import privateContext from '../../../../context';

import { consoleDebug, consoleError } from '../../../../../../console_styles';
import { updateOnboardingDataThunk } from '../../../../redux/thunk';

import { useDispatch } from 'react-redux';
import { getAllCurrencyCodeDropdownOptions} from '../../../../utils';

import './styles.css'

export default function OnboardingForm({modalRef}) {

    const dispatch = useDispatch();
    
    const saveButtonRef = useRef();
    const {user: {uid}} = useContext(privateContext)

    // currency dropdown options
    const options = useMemo(()=>{
        return getAllCurrencyCodeDropdownOptions()
    }, [])

    async function onFinish(values) {

        const {defaultCurrency} = values;
        console.log('ONBOARDINGfORM Submit --- DEFAULTcURRENCY', defaultCurrency);

        saveButtonRef.current.setButtonLoading();
        
        try {
            consoleDebug('FORM SUBMIT ACTION: dispatch( updateOnboardingDataThunk(uid, values) )');
            await dispatch(updateOnboardingDataThunk(uid, values));
            consoleDebug('DONE DISPATCH');
            
            
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