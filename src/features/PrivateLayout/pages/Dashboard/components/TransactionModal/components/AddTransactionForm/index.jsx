import { Form, Select, Flex, Input, Divider, DatePicker, Button } from 'antd'
import ActionButton from '../../../../../../../../components_common/ActionButton'

import { useSelector } from 'react-redux'
import { selectDefaultCurrency } from '../../../../../../redux/selectors'
import { getAllCurrencyCodeDropdownOptions } from '../../../../../../utils'
import { transactionType } from '../../../../../../../../enums'
import { selectBalance } from '../../../../../../redux/selectors'
import TagsDropdown from './components/TagsDropdown'
import { useMemo } from 'react'

import './styles.css'
import DateTimePicker from './components/DateTimePicker'

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
export default function AddTransactionForm({ transactionType: type, additionalFormItems, onFinishCheck, formFieldRules }) {

  const currency = useSelector(selectDefaultCurrency);
  const balanceList = useSelector(selectBalance);  

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

  const onFinish = async (values) => {

    let submitForm = true;
    if (onFinishCheck) {

      submitForm = onFinishCheck(values);
    }

    if (submitForm) {
      console.log(values);
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
        type: type.toString().toUpperCase(),        
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
                key: transactionType.INCOME
              }, 
              {
                label: transactionType.EXPENDITURE.toUpperCase(), 
                key: transactionType.EXPENDITURE
              }
            ]}
            value={type}
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
        <Button 
          type='primary' 
          htmlType='submit'>
            Create {type.toUpperCase()} Transaction
        </Button>
      </Flex>
    </Form>
  )
}