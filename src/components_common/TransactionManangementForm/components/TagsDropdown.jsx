import { useSelector } from "react-redux";
import { wrapper_selectTagsOfType } from "../../../features/PrivateLayout/redux/selectors";
import { Divider, Form, Select } from "antd";
import CreateTagCompact from "../../../features/PrivateLayout/components/CreateTagCompact";
import { useEffect } from "react";

export default function TagsDropdown({defaultType, form}) {  

  // retrieves value post-render, undefined during initial render
  const selectedType = Form.useWatch('type', form);
  
  const tagsList = useSelector(wrapper_selectTagsOfType(selectedType))
  // console.log('selectedType:',selectedType,'defaultType:', defaultType, 'tagsList', tagsList)

  useEffect(()=>{
    if (Boolean(selectedType)) {

      if (selectedType != defaultType) form.setFieldValue('tagId', undefined);      
    }
  }, [selectedType])

  return (
    <Form.Item
      name='tagId'
      label='Tag'
      rules={[
        { required: true, message: 'Please Select Tag' }
      ]}
    >

      <Select
        placeholder="Select Tag"
        showSearch
        optionFilterProp="label"

        options={
          tagsList.map(tagItem => {
            return {
              label: tagItem.data.name,
              value: tagItem.id
            }
          })
        }

        dropdownRender={(menu) => {
          return (
            <>
              {menu}
              <Divider />
              <CreateTagCompact type={selectedType} />
            </>
          )
        }}
      />

    </Form.Item>
  )
}