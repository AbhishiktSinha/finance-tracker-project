import { ColorPicker, Flex, Input } from "antd";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import ActionButton from "../../../../components_common/ActionButton";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createTagThunk } from "../../redux/thunk";
import userAuthContext from "../../context/userAuthContext";
import { consoleDebug, consoleError } from "../../../../console_styles";

export default function CreateTagCompact({type}) {

    const dispatch = useDispatch();

    const defaultState = useMemo(()=>{
        return {
            name: '', 
            color: '',
        }
    }, [])

    const [tagData, setTagData] = useState(defaultState)

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
    
    const handleColorChange = (value) => {
        setTagData({
            ...tagData, 
            color: value
        })
    }

    const handleClick = async ()=>{
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
                    onChange={handleColorChange}
                    panelRender={(panel) => (
                        <div
                          onMouseDown={(e) => {
                            // Prevent the Select dropdown from closing
                            e.preventDefault();
                            e.stopPropagation();
                          }}                          
                        >
                          {panel}
                        </div>
                    )}
                />

            </div>

            <ActionButton 
                ref={actionButtonRef}
                replaceChildrenOnLoad={true}
                onClick={handleClick}
            >
                <PlusOutlined />
            </ActionButton>
        </Flex>
    )
}