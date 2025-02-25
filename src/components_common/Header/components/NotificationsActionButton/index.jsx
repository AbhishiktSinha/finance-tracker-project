import { BellFilled, BellOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function NotificationsActionButton() {

    return (
        <Button 
            className='navbar-action-button notification-button'
            shape='circle'     
            type='outlined'
            ghost={true}
        >            
            <BellOutlined className="default-icon" />
            <BellFilled className="hover-icon" />
        </Button>
    )
}