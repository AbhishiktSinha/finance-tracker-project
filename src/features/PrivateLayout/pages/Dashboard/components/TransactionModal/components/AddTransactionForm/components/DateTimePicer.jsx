import { DatePicker, Form } from "antd";
import { range } from "../../../../../../../utils";
import dayjs from "dayjs";
import { consoleDebug, consoleInfo } from "../../../../../../../../../console_styles";

export default function DateTimePicker({name}) {

    /* const disabledDateTime = (selectedValue) => {
        console.log('SELECTED VALUE:', selectedValue);
    
        const selectedDate = dayjs(selectedValue).format('YYYY-MM-DD');
        const selectedHours = dayjs(selectedValue).hour();
    
        const currentTime = dayjs();
        const currentDate = currentTime.format('YYYY-MM-DD');
        const currentHours = currentTime.hour();
        const currentMinutes = currentTime.minute();
    
        if (selectedDate == currentDate) {
          consoleInfo(`currentHour:${currentHours} \tselectedHour:${selectedHours}\n
            currentDate: ${currentDate} \tselectedDate: ${selectedDate}`);
          return {
            disabledHours: () => {
              return range(currentHours + 1, 24);
            },
            disabledMinutes: () => {
              if (currentHours == selectedHours) {
                return range(currentMinutes + 1, 60);
              } else {
                return [];
              }
            },
          };
        }
    
        return {
          disabledHours: () => {
            return [];
          },
          disabledMinutes: () => {
            return [];
          },
        };
      }; */
    
      const disabledTime = (selectedValue)=>{
        consoleDebug('disabledTime Function')
        return {
            disabledHours: ()=>{
                consoleDebug('disabledHours nested function')
                return [1,2, 3, 4, 5, 12, 14, 15, 16, 17]
            }, 
            disabledMinutes: ()=>{
                consoleDebug('disabledMinutes nested function')
                return [15, 30, 45]
            }
        }
      }

      return (
        <Form.Item
          name={'occurredAt'}
          label="Date and Time"
          rules={[{ required: true, message: 'Please Select Date & Time' }]}
        >
          <DatePicker
            rootClassName="transaction-date-picker"
            placeholder="Select Date & Time"
            showTime={{
              disabledTime: disabledTime,
              showSecond: false,
              use12Hours: true,
              minuteStep: 1,
              defaultOpenValue: dayjs(),
            }}
            maxDate={dayjs()}
          />
        </Form.Item>
      );
}