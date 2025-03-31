import React, { useContext, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Form, Select, Flex, Input, Divider, DatePicker, Button } from 'antd'
import dayjs from 'dayjs'

import { selectBalanceDataList } from '../../features/PrivateLayout/redux/selectors'
import { selectDefaultCurrency } from '../../features/PrivateLayout/redux/selectors'


import userAuthContext from '../../features/PrivateLayout/context/userAuthContext'
import modalContext from '../ModalWrapper/context'

import ActionButton from '../ActionButton'
import TagsDropdown from './components/TagsDropdown'
import DateTimePicker from './components/DateTimePicker'
import TypeAndTags from './components/TypeAndTags.jsx'
import SelectCurrency from './components/SelectCurrency.jsx'

import { consoleError, consoleInfo } from '../../console_styles'
import { getAllCurrencyCodeDropdownOptions } from '../../features/PrivateLayout/utils'
import { transactionType } from '../../enums'
import './styles.css'

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

/**
 * 
 * @param {object} props
 * @param {boolean} props.modification true | false, signifies whether this is modification case or creation case
 * @param {object} props.defaults the default values for the form field
 * @param {string} props.transactionType 'income' | 'expenditure' 
 * @param {function} props.onFinishCheck additional validation before submit, can throw error
 * @param {function} props.onFinishAction function to be called on submit, called with form data and modifiedFields data
 * @returns {React.Component} TransactionManagementForm
 */
export default function TransactionMangementForm({ 
  modification, defaults, transactionType: type, additionalFormItems, onFinishCheck, onFinishAction, formFieldRules }) {

  // ----------------------------- selectors -------------
  const currency = useSelector(selectDefaultCurrency);
  // const balanceList = useSelector(selectBalanceData);
  const balanceList = useSelector(selectBalanceDataList)

  // ------------------------------ context --------------
  const { user: { uid } } = useContext(userAuthContext)
  const { closeModal } = useContext(modalContext)

  const dispatch = useDispatch();

  const actionButtonRef = useRef();

  const currencyOptions = useMemo(() => {

    if (type == transactionType.INCOME) {
      return getAllCurrencyCodeDropdownOptions()
    }
    else {
      return balanceList.map(
        ({ id, data }) => {
          return {
            label: id,
            value: id
          }
        })
    }

  }, [])

  // -------------------------------- form submit handler -----
  const onFinish = async (fieldValues) => {

    // change `occurredAt` from a dayjs instance to a timestamp
    // no one likes to see dayjs when they are expecting a timestamp
    fieldValues['occurredAt'] = fieldValues.occurredAt.valueOf();

    // change the amount from string to a number
    fieldValues['amount'] = Number(fieldValues.amount);

    // find the modifiedFields
    const modifiedFields = {}; 
    if (modification) {
      
      for (let key in fieldValues) {
        
        if (defaults[key] != fieldValues[key]) {
          // modifiedField: previousValue        
          modifiedFields[key] = defaults[key];
        }
      }
    }

    try {

      consoleInfo('Form Field Values');
      console.log(fieldValues);

      onFinishCheck && onFinishCheck(fieldValues);

      const now = dayjs().valueOf();

      
      actionButtonRef.current.setButtonLoading();
      
      await onFinishAction(fieldValues, modifiedFields);

      closeModal();
      
    }
    catch (submitError) {
      consoleError(submitError)
        console.log(submitError);
    }
    finally {
      console.log(actionButtonRef);
      actionButtonRef.current.setButtonActive();
    }

  } 

  const [form] = Form.useForm();

  return (
    <Form
      form={form}

      rootClassName={`add-transaction-form ${transactionType}-form`}
      scrollToFirstError
      layout='vertical'

      onFinish={onFinish}
      initialValues={{
        currency: currency.code,
        type: type,

        ...(defaults && {
          ...defaults, 
          occurredAt: dayjs(defaults.occurredAt)
        })
      }}
    >
      
      {/* ---------- Transaction ID for MODIFICATION case ------------------- */}
      {
        modification && defaults.id && (
          <Flex rootClassName='transaction-form-row transaction-id-row'>
            <Form.Item 
              hidden
              name="id"
              label="Transaction ID"
            >
              <Input disabled />
            </Form.Item>

            <p className="transaction-id-container">Transaction Id: 
              <span className="transaction-id">{defaults.id}</span>
            </p>
          </Flex>          
        )
      }

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
        {/* <Form.Item
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
        </Form.Item> */}
        <SelectCurrency defaultType={type} form={form}/>

        {/* AMOUNT */}
        <Form.Item
          name='amount'
          label='Amount'
          rules={[
            { required: true, message: 'Please Enter Amount' },
            { pattern: /^[1-9]\d*$/, message: 'Please Enter a Valid Number' }
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
            { required: true, message: 'Please select Type' }
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

            {...(type && !modification && { disabled: true })}
          />

        </Form.Item>

        {/* TAG */}
        <TagsDropdown defaultType={type} form={form}/>

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
          {modification ? 'Save Changes' : `Create ${type.toUpperCase()} Transaction`}
        </ActionButton>
      </Flex>
    </Form>
  )
}