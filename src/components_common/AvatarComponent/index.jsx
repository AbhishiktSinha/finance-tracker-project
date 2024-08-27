import { useCallback, useState } from "react";

import { Tooltip, Popover, Button, Avatar } from "antd";
import { SettingFilled, SettingOutlined } from "@ant-design/icons";

import './styles.css';
import { logOutUser } from "../../firebase/auth";

/**
 * sizes: small 20px | medium 35px | large 50px
 * Image will be used as avatar if provided
 * Otherwise provide the first letter of display name
 * additional styles can be passed as styles object
 */
export default function AvatarComponent({ size, shape, displayName, photoUrl, email, ...restProps }) {

    const { style } = restProps;

    const [tooltipOpen, setTooltipOpen] = useState(false)
    const handleOpenChange = (newOpen) => {
        setTooltipOpen(newOpen);
    }

    const defaultActionJSX = {

        tooltip: displayName.includes(' ') ? displayName.slice(0, displayName.indexOf(' ')) : displayName,

        popover: (
            <div className="popover-default-container">

                <div className="user-data-container">
                    {/* <h2 className="user-display-name">{`${first_name} ${last_name}`}</h2> */}
                    <p className="user-email">{email}</p>
                </div>

                <div className="user-actions-container">
                    <Button 
                        type="default" 
                        content="Log Out"
                        onClick={logOutUser}
                    >Log Out
                    </Button>
                    <Button type="default" shape="circle"><SettingFilled /></Button>
                </div>
            </div>
        )
    }

    return (
        <Popover
            title={displayName}
            content={defaultActionJSX.popover}
            trigger={'click'}
            className="userQuickActions"            
        >
            <Tooltip
                placement={'bottomRight'}
                title={defaultActionJSX.tooltip}
                open={tooltipOpen}
                onOpenChange={handleOpenChange}
                arrow={false}                
            >
                <Avatar
                    shape="cirlce"
                    size='default'
                    style={{
                        cursor: 'pointer',
                        ...style,
                    }}
                    {...(photoUrl ? { icon: <img src={photoUrl} alt="" /> }
                        :
                        { icon: `${displayName.charAt(0)}` }
                    )}
                    onClick={() => handleOpenChange(false)}
                />

            </Tooltip>
        </Popover>
    )
}