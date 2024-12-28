import { DatePicker, Form } from "antd";
import { range } from "../../../features/PrivateLayout/utils";
import dayjs from "dayjs";
import { consoleDebug, consoleInfo } from "../../../console_styles";


export default function DateTimePicker({name}) {

    const disabledDateTime = (selectedValue) => {
        // console.log('SELECTED VALUE:', selectedValue);
    
        const selectedDate = dayjs(selectedValue).format('YYYY-MM-DD');
        const selectedHours = dayjs(selectedValue).hour();
    
        const currentTime = dayjs();
        const currentDate = currentTime.format('YYYY-MM-DD');
        const currentHours = currentTime.hour();
        const currentMinutes = currentTime.minute();
    
        if (selectedDate == currentDate) {
          /* consoleInfo(`currentHour:${currentHours} \tselectedHour:${selectedHours}\n
            currentDate: ${currentDate} \tselectedDate: ${selectedDate}`); */
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
      };
          
      return (
        <Form.Item
          name={name}
          label="Date and Time"
          rules={[{ required: true, message: 'Please Select Date & Time' }]}
        >
          <DatePicker
            rootClassName="transaction-date-picker"
            // picker="time"
            placeholder="Select Date & Time"
            showTime={{
              disabledTime: disabledDateTime,
              showSecond: false,
              use12Hours: true,
              minuteStep: 1,
              defaultOpenValue: dayjs(),
            }}
            // disabledTime={disabledTime}
            maxDate={dayjs()}
          />
        </Form.Item>
      );
}