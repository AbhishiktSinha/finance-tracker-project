import { Form, Select, Flex, Input } from 'antd'
import ActionButton from '../../../../../../../../components_common/ActionButton'

import './styles.css'
import { useSelector } from 'react-redux'
import { selectDefaultCurrency } from '../../../../redux/selectors'
import { getAllCurrencyCodeDropdownOptions } from '../../../../../../utils'
import { transactionType } from '../../../../../../../../enums'

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
  const balanceObject = useSelector(({ userDoc }) => userDoc.data?.balance);

  const currencyOptions = useMemo(() => {

    if (type == transactionType.INCOME) {
      return getAllCurrencyCodeDropdownOptions()
    }
    else {
      return Object.keys(balance).map(code => {
        return {
          label: code,
          value: code
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
        currency: currency,

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
            defaultValue={currency}
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
      </Form.Item>
    </Form>
  )
}