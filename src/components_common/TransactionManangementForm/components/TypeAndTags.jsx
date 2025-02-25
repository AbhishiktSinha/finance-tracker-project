import { Form, Select } from "antd";
import { useState } from "react";
import TagsDropdown from "./TagsDropdown";
import { transactionType } from "../../../enums";

export default function TypeAndTags({ defaultType, modification }) {

    const [type, setType] = useState(defaultType);

    const onTypeChange = (e) => {
        setType(e);
    }

    return (
        <>
            {/* TYPE */}
            <Form.Item
                name={'type'}   
                label='Type'
                rules={[
                    { required: true, message: 'Please select Type' }
                ]}
            >
                <Select
                    onChange={onTypeChange}
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
            <TagsDropdown type={type} clearDefault={true}/>
        </>
    )
}