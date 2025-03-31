import { useContext, useState } from "react";
import { DayJSUtils } from "../../../../../../dayjs";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import modalContext from "../../../../../../components_common/ModalWrapper/context";

export default function CustomTimeframeModal({defaultValue, submitValue}) {

    const [value, setValue] = useState({
        start: defaultValue?.start || dayjs().startOf('day').valueOf(), 
        end: defaultValue?.end || dayjs().endOf('day').valueOf(),
    })

    const {closeModal} = useContext(modalContext)

    console.log(value);

    function onClick() {
        submitValue(value.start, value.end);
        closeModal();
    }

    /**
     * Start at the startOf DAY for the selected start date
     */
    function setStartLimit(dayjsDate) {
        setValue( value => ({
            ...value, 
            start: dayjsDate.startOf('day').valueOf()
        }))
    }

    /**
     * End at the endOf DAY for the selected end date
     * @param {dayjs} dayjsDate 
     */
    function setEndLimit(dayjsDate) {
        setValue( value => ({
            ...value, 
            end: dayjsDate.endOf('day').valueOf()
        }))
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

                    onChange={setStartLimit}
                />
                <DatePicker 
                    key={'end'}
                    name='end'
                    placeholder="To"
                    defaultValue={dayjs(value.end)}

                    allowClear={false}

                    onChange={setEndLimit}
                />

            </div>

            <Button type='primary' shape="round" onClick={onClick}>Set</Button>
        </div>
    )
}