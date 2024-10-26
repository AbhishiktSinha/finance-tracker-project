import { Button, ColorPicker, Flex, Input, Form } from "antd";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import ActionButton from "../../../../components_common/ActionButton";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createTagThunk } from "../../redux/thunk";
import userAuthContext from "../../context/userAuthContext";

import { consoleDebug, consoleError } from "../../../../console_styles";

import './styles.css'

export default function CreateTagCompact({type}) {

    const dispatch = useDispatch();

    const defaultState = useMemo(()=>{
        return {
            name: '', 
            color: '',
        }
    }, [])

    const [tagData, setTagData] = useState(defaultState)
    const [pickerOpen, setPickerOpen] = useState(false);

    const actionButtonRef = useRef();
    const inputRef = useRef();

    const {user: {uid}} = useContext(userAuthContext);

    const handleInputChange = (e)=>{

        consoleDebug(`color: ${tagData.color? tagData.color.toHexString(): ''}`);
        const value = e.target.value;
        setTagData({
            ...tagData, 
            name: value
        })
    }
    
    const handleColorPickerOpenChange = (open)=>{
        setPickerOpen(open);
        consoleDebug(`Color Picker open: ${open}`);
    }
    const handleColorChange = (value) => {
        setTagData({
            ...tagData, 
            color: value
        })
    }

    const handleSubmitClick = async ()=>{
        //dispatch thunk to update the tag in the backend and in redux store
        //clear the input
        //revert colorpicker to the default value
        
        if (tagData.color=='' || tagData.name=='') {
            consoleError('Empty Inputs')
            return;
        }

        actionButtonRef.current.setButtonLoading();
        
        try {
            await dispatch(createTagThunk(uid, {
                name: tagData.name, 
                color: tagData.color? tagData.color.toHexString() : '',
                origin: 'custom'
            }))

            setTagData(defaultState);
        }
        catch(e) {
            consoleError(e.message)
        }
        finally {
            actionButtonRef.current.setButtonActive();
            inputRef.current.focus();
        }

    }

    return (
        <Form.Item 
            rules={[]}
        >

            <Flex rootClassName="create-tag-compact" >
                
                <Input 
                    name="tag-name-input"
                    key={'tag-name-input'}
                    placeholder="Tag Name"
                    value={tagData.name}
                    onChange={handleInputChange}
                    ref={inputRef}
                />

                <div 
                    className="click-stop-propagation"
                    onClick={(e)=>{
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    >

                    <ColorPicker
                        value={tagData.color}
                        placement="topRight"
                        open={pickerOpen}
                        onOpenChange={handleColorPickerOpenChange}
                        onChange={handleColorChange}
                        panelRender={(panel) => (
                            <div
                                className="picker-panel-wrapper"
                            onMouseDown={(e) => {
                                // Prevent the Select dropdown from closing
                                e.preventDefault();
                                e.stopPropagation();
                                consoleDebug(`Click caught in Panel Wrapper`)
                            }}                          
                            >
                            {panel}
                            <div className="panel-bottom-row">
                                <Button 
                                    onClick={()=>setPickerOpen(false)}
                                    >
                                        Select
                                </Button>
                            </div>
                            </div>
                        )}
                    />

                </div>

                <ActionButton 
                    ref={actionButtonRef}
                    replaceChildrenOnLoad={true}
                    onClick={handleSubmitClick}
                    rootClassName='add-tag-button'
                >
                    <PlusOutlined />
                </ActionButton>
            </Flex>

        </Form.Item>
    )
}