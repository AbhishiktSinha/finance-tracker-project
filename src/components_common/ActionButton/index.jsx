import { Button } from "antd";
import { useState, useImperativeHandle, forwardRef } from "react";

const ActionButton = forwardRef( 
    ({children, ...buttonProps }, ref) => {
        // button states: disabled (flag: loading), active
        const [buttonState, setButtonState] = useState({
            active: true,
            loading: false,
        })

        // allow limited access to state
        useImperativeHandle(ref, () => {

            return {
                setButtonDisabled: () => {
                    setButtonState({ active: false, loading: false })
                },

                setButtonLoading: () => {
                    setButtonState({ active: false, loading: true })
                },

                setButtonActive: () => {
                    setButtonState({ active: true, loading: false })
                }
            }

        }, [])

        return (
            <Button {...buttonProps}
                disabled={!buttonState.active}
                loading={buttonState.loading}
            >
                {children}
            </Button>
        )
    }
)

export default ActionButton;