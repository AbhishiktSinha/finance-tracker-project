import { Form, Select, Flex, Input, Divider, DatePicker, Button } from 'antd'
import ActionButton from '../../../../../../../../components_common/ActionButton'

import { useDispatch, useSelector } from 'react-redux'
import { selectDefaultCurrency } from '../../../../../../redux/selectors'
import { getAllCurrencyCodeDropdownOptions } from '../../../../../../utils'
import { transactionType } from '../../../../../../../../enums'
import { selectBalance } from '../../../../../../redux/selectors'
import TagsDropdown from './components/TagsDropdown'
import { useContext, useMemo, useRef } from 'react'

import './styles.css'
import DateTimePicker from './components/DateTimePicker'
import dayjs from 'dayjs'
import { updateTransactionThunk } from '../../../../../../redux/thunk'
import { consoleError, consoleInfo } from '../../../../../../../../console_styles'
import userAuthContext from '../../../../../../context/userAuthContext'
import modalContext from '../../../../../../../../components_common/ModalWrapper/context'

/*BASIC JSX STRUCTURE

FORM FIELDS: {
    title,
    currency,
    amount,
    tag,
    date,
    time
}

Basic Data Handling
Create transaction object using form values
Call addTransactionThunk to handle backend and frontend data updation
  */

/*
onFinishDispatch is recieved as an argument instead of defining it within the form, because the form is meant to be reusable across the app
*/

export default function AddTransactionForm({ transactionType: type, additionalFormItems, onFinishCheck, onFinishDispatch, formFieldRules }) {

  // ----------------------------- selectors -------------
  const currency = useSelector(selectDefaultCurrency);
  const balanceList = useSelector(selectBalance);  

  // ------------------------------ context --------------
  const {user: {uid}} = useContext(userAuthContext)
  const {closeModal} = useContext(modalContext)

  const dispatch = useDispatch();

  const actionButtonRef = useRef();

  const currencyOptions = useMemo(() => {

    if (type == transactionType.INCOME) {
      return getAllCurrencyCodeDropdownOptions()
    }
    else {
      return balanceList.map( 
        ({id, data}) => {
        return {
          label: id,
          value: id
        }
      })
    }

  }, [])

  // -------------------------------- form submit handler -----
  const onFinish = async (values) => {

    let submitForm = true;
    if (onFinishCheck) {

      submitForm = onFinishCheck(values);
    }

    if (submitForm) {

      const {occurredAt, amount, ...restValues} = values;
      const now = dayjs().valueOf();

      const data = {
        
        timestamp: {
          createdAt: now, 
          occurredAt: occurredAt.valueOf(), 
          modifiedAt: now,
        }, 

        amount: Number(amount), 
        
        ...restValues, 

      }
      console.log(data);

      try {

        actionButtonRef.current.setButtonLoading();
        const transactionObject = await dispatch(updateTransactionThunk(uid, data, onFinishDispatch));

        consoleInfo('TRANSACTION ADDED TO FIRESTORE using AddTransactionForm');
        console.log(transactionObject);  
        
        closeModal();
        
      }
      catch(e) {
        consoleError(`AddTransactionFormError:\n`);
        console.log(e);
      }
      finally {
        actionButtonRef.current.setButtonActive();
      }
    }
  }

  
  return (
    <Form
      rootClassName={`add-transaction-form ${transactionType}-form`}
      scrollToFirstError
      layout='vertical'

      onFinish={onFinish}
      initialValues={{
        currency: currency.code,
        type: type,        
      }}
    >
      {/* ---------------------------------------TITLE------------------------- */}
      <Form.Item
        name='title'
        label='Title'
        rules={[
          { required: true, message: 'Please enter the transaction title' }
        ]}
      >
        <Input placeholder='Transction Title' />
      </Form.Item>

      {/* ----------------------CURRENCY AND AMOUNT------------------------- */}
      <Flex rootClassName='transaction-value-section transaction-form-row'>
        {/* CURRENCY */}
        <Form.Item
          name='currency'
          label='Currency'
          rules={[
            { required: true, message: 'Please Select Currency' }
          ]}
        >
          <Select
            options={currencyOptions}
            showSearch            
          />
        </Form.Item>

        {/* AMOUNT */}
        <Form.Item
          name='amount'
          label='Amount'
          rules={[
            { required: true, message: 'Please Enter Amount' },
            { pattern: /^[1-9]\d*$/, message: 'Please Enter a Valid Number'}
          ]}
        >
          <Input placeholder='0000' />
        </Form.Item>

      </Flex>

      {/* -------------------------------TYPE AND TAGS------------------------------ */}
      <Flex rootClassName='type-tag-section transaction-form-row' >
        
        {/* TYPE */}
        <Form.Item 
          name={'type'}
          label='Type'
          rules={[
            { required: true, message: 'Please select Type'}
          ]}
        >
          <Select 
            options={[
              {
                label: transactionType.INCOME.toUpperCase(), 
                value: transactionType.INCOME
              }, 
              {
                label: transactionType.EXPENDITURE.toUpperCase(), 
                value: transactionType.EXPENDITURE
              }
            ]}
            
            {...(type && {disabled: true})}
          />
        
        </Form.Item>

        {/* TAG */}
        <TagsDropdown type={type} />         

      </Flex>

      {/* ------------------------------------ DATE & TIME --------------------------------------- */}
      <Flex rootClassName='transaction-form-row date-time-section'>        
        <DateTimePicker name={'occurredAt'} />
      </Flex>

      <Flex rootClassName='transaction-form-row'>
        <ActionButton 
          type='primary'
          htmlType='submit'
          ref={actionButtonRef}
        >
          Create {type.toUpperCase()} Transaction
        </ActionButton>        
      </Flex>
    </Form>
  )
}