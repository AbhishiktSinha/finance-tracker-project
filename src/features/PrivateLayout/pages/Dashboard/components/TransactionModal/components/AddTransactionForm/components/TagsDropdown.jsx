import { useSelector } from "react-redux";
import { wrapper_selectTagsOfType } from "../../../../../../../redux/selectors";
import { Divider, Select } from "antd";
import CreateTagCompact from "../../../../../../../components/CreateTagCompact";

export default function TagsDropdown({type}) {

    const tagsList = useSelector(wrapper_selectTagsOfType(type))

    return (
        <Select 
          placeholder="Select Tag"
          
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
                  
        ></Select>
    )
}