import { useSelector } from "react-redux";
import { wrapper_selectTagsOfType } from "../../../features/PrivateLayout/redux/selectors";
import { Divider, Form, Select } from "antd";
import CreateTagCompact from "../../../features/PrivateLayout/components/CreateTagCompact";

export default function TagsDropdown({type}) {

    const tagsList = useSelector(wrapper_selectTagsOfType(type))

    return (
      <Form.Item
        name='tagId'
        label='Tag'
        rules={[
          {required: true, message: 'Please Select Tag'}
        ]}
      >

          <Select 
            placeholder="Select Tag"

            showSearch
            optionFilterProp="label"
            
            options={
              tagsList.map(tagItem=>{
                return {
                  label: tagItem.data.name, 
                  value: tagItem.id
                }
              })
            }
            
            dropdownRender={(menu)=>{
              return (
                  <>
                    {menu}
                    <Divider />                  
                  <CreateTagCompact type={type}/>
                  </>
              )
            }}
            />

      </Form.Item>
    )
}