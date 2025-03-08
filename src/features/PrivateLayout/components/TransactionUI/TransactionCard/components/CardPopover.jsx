import { Popover } from "antd";
import { useEffect, useMemo, useState } from "react"

export default function CardPopover({ children,
    cardElementRef, triggerElementRef, cardEvent, triggerEvent, popoverMenu, ...popoverProps }) {

    
    const [isOpen, setIsOpen] = useState(false);
    const [positioning, setPositioning] = useState(undefined)    

    const Content = useMemo(()=>{
        return (
            <ul className="popover-menu-list">
                {
                    popoverMenu.map(
                        ({ title, icon, onClick }, index) => {

                            return (
                                <li 
                                    key={index+''+title}
                                    className="popover-menu-list-item"
                                    // close popover && do the rest of operations
                                    onClick={()=>{
                                        onClick(); 
                                        setTimeout(
                                            ()=>{setIsOpen(false)}, 
                                            0
                                        )
                                    }}>
                                    <span className="popover-menu-item-icon">{icon}</span>
                                    <span className="popover-menu-item-title">{title}</span>
                                </li>
                            )
                        }
                    )
                }
            </ul>
        )
    }, [popoverMenu])

    function onOpenChange(open) {
        setIsOpen(open)
    }

    /* ------------ context menu effect for card ---------- */
    useEffect(()=>{
        // must be a mouse event
        function handleCardEvent(e) {

            e.preventDefault();

            setIsOpen(true);
            setPositioning({
                top: e.offsetY, 
                left: e.offsetX,
            })
        }

        const cardElement = cardElementRef.current;

        cardElement.addEventListener(cardEvent, handleCardEvent);

        return ()=>{cardElement.removeEventListener(cardEvent, handleCardEvent)};

    }, [])
    /* ------------- trigger effect for trigger element --------- */ 
    useEffect(()=>{
        function handleTriggerEvent(e) {
            setPositioning(undefined);
        }

        const triggerElement = triggerElementRef.current;

        triggerElement.addEventListener(triggerEvent, handleTriggerEvent)

        return ()=>{triggerElement.removeEventListener(triggerEvent, handleTriggerEvent)}
    }, [])

    /* ------------- esc keydown sensitivity effect ------------ */
    useEffect(()=>{
        function handleEscKeydown(e) {
            if(e.key == 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen){ 
            window.addEventListener('keydown', handleEscKeydown);
        }
        else {
            window.removeEventListener('keydown', handleEscKeydown);
        }

        return ()=>{window.removeEventListener('keydown', handleEscKeydown)};
    })


    return (
        <Popover
            // rootClassName="transaction-card-popover"
            overlayClassName="transaction-card-popover"
            content={Content}
            arrow={false}
            placement={'bottomRight'}
            trigger='click'
            open={isOpen}
            onOpenChange={onOpenChange}
            getPopupContainer={(triggerElement) => triggerElement.parentElement}
            
            {...(positioning
                ? {
                    overlayStyle: {
                        position: 'absolute',
                        ...positioning,
                    },
                }
                : {})}

            {...popoverProps}
        >
            {children}
        </Popover>
    )
    
}