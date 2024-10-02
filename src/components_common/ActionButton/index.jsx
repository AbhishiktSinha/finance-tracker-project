import { Button } from "antd";
import { useState, useImperativeHandle, forwardRef } from "react";


/**
 * HOC that isolates the button loading state to prevent unnecessary re-renders of parent component
 * 
 * Returns an AntD button component with added prop: `replaceChildreOnLoad <boolean> : true | false`, default false
 * 
 * This prop determines whether the loading spinner replaces the children, or is prepended, on loading state of the button
 */
const ActionButton = forwardRef( 
    ({children, replaceChildrenOnLoad=false, ...buttonProps }, ref) => {
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
                {
                    !buttonState.loading ? 
                    children : 
                    (!replaceChildrenOnLoad ? children : '')
                }
            </Button>
        )
    }
)

export default ActionButton;