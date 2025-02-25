import { useSelector } from "react-redux";
import { selectBalanceData } from "../../../features/PrivateLayout/redux/selectors";
import { Form, Select } from "antd";
import { transactionType } from "../../../enums";
import { getAllCurrencyCodeDropdownOptions } from "../../../features/PrivateLayout/utils";
import { useEffect, useMemo } from "react";

export default function SelectCurrency({ defaultType, form }) {

    const balanceList = useSelector(selectBalanceData);

    const selectedType = Form.useWatch('type');

    const currencyOptions = useMemo(() => {
        if (selectedType == transactionType.INCOME) {
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
    }, [selectedType])

    useEffect(()=>{
        
        if (selectedType == transactionType.INCOME) {
            // no problemo
        }
        else {
            
            const selectedCurrency = form.getFieldValue('currency');
            const validCurrencySelection = Boolean(currencyOptions.find(
                ({label, value})=> value == selectedCurrency))

            console.log('selectedCurrency:',selectedCurrency, 'isValid for Expenditure:', validCurrencySelection);

            if (!validCurrencySelection) {
                const fallbackCurrencySelection = currencyOptions[0].value
                console.log('fallbackCurrencySelection:',fallbackCurrencySelection);
                form.setFieldValue('currency', fallbackCurrencySelection)
            }
        }

    }, [selectedType])

    return (
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
    )
}