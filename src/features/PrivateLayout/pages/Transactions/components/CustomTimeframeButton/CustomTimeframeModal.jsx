import { useContext, useState } from "react";
import { DayJSUtils } from "../../../../../../dayjs";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import modalContext from "../../../../../../components_common/ModalWrapper/context";

export default function CustomTimeframeModal({defaultValue, submitValue}) {

    const [value, setValue] = useState({
        start: defaultValue?.start || DayJSUtils.getLoginTimeStamp(), 
        end: defaultValue?.end || DayJSUtils.getLoginTimeStamp(),
    })

    const {closeModal} = useContext(modalContext)

    console.log(value);

    function onClick() {
        submitValue(value.start, value.end);
        closeModal();
    }

    return (
        <div className="custom-timeframe-modal-content">
            <div className="date-picker-container">

                <DatePicker 
                    name='start'
                    placeholder="From"
                    defaultValue={dayjs(value.start)} 

                    key={'start'}
                    
                    allowClear={false}

                    onChange={(dayjsDate)=>{
                        setValue( value => ({
                            ...value, 
                            start: dayjsDate.valueOf()
                        }))
                    }}
                />
                <DatePicker 
                    key={'end'}
                    name='end'
                    placeholder="To"
                    defaultValue={dayjs(value.end)}

                    allowClear={false}

                    onChange={(dayjsDate)=>{
                        setValue( value => ({
                            ...value, 
                            end: dayjsDate.valueOf()
                        }))
                    }}
                />

            </div>

            <Button type='primary' shape="round" onClick={onClick}>Set</Button>
        </div>
    )
}