import { Form, Select, Flex, Input, Divider } from 'antd'
import ActionButton from '../../../../../../../../components_common/ActionButton'

import './styles.css'
import { useSelector } from 'react-redux'
import { selectDefaultCurrency } from '../../../../../../redux/selectors'
import { getAllCurrencyCodeDropdownOptions } from '../../../../../../utils'
import { transactionType } from '../../../../../../../../enums'
import { selectBalance } from '../../../../../../redux/selectors'
import TagsDropdown from './components/TagsDropdown'
import { useMemo } from 'react'

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
        
      }}
    >
      {/* TITLE */}
      <Form.Item
        name='title'
        label='Title'
        rules={[
          { required: true, message: 'Please enter the transaction title' }
        ]}
      >
        <Input placeholder='Transction Title' />
      </Form.Item>

      {/* CURRENCY AND AMOUNT */}
      <Flex
        rootClassName='transaction-value-section'
      >
        {/* CURRENCY */}
        <Form.Item
          name='currency'
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
          rules={[
            { required: true, message: 'Please Enter Amount' },
            { type: 'number', message: 'Plesae Enter A Valid Number' }
          ]}
        >
          <Input placeholder='0000' />
        </Form.Item>

      </Flex>

      {/* TAGS */}
      <Form.Item
        name='tag'
        rules={[
          { required: true, message: 'Please select tag' }
        ]}
      >
        {/* TODO: add tag selection dropdown, with loading state spinner */}
        <TagsDropdown 
          type={type} 
          />
      </Form.Item>
    </Form>
  )
}