import { useState } from "react";

export default function useCardPopover() {

    const [isOpen, setIsOpen] = useState(false);
    const [positioning, setPositioning] = useState(undefined);

    /* ------ CARD EVENT HANDLER ---------- */
    function handleContextMenu(e){ 

        setIsOpen(true);
        setPositioning({
            position: 'absolute',
            top: e.nativeEvent.offsetY, 
            left: e.nativeEvent.offsetX,
        })
    }
    /* --------- TRIGGER EVENT => RESTORE DEFAULT -------- */
    function handleClick(e) {
        setPositioning(undefined);
    }

    /* ----------- POPOVER OPEN STATE-CHANGE HANDLER ---------  */
    function onOpenChange(open) {
        setIsOpen(open);
    }

    /* ---------- ESCAPE key responsiveness ------------ */
    useEffect(()=>{

        function handleEscKeyDown(e) {
            
            if (e.key == 'Escape' && isOpen) {
                setIsOpen(false);
            }
        }

        // when open, window watches
        if (isOpen) {
            window.addEventListener('keydown', handleEscKeyDown);
        }
        else {
            window.removeEventListener('keydown', handleEscKeyDown);
        }

        return ()=>{window.removeEventListener('keydown', handleEscKeyDown)};

    }, [isOpen])

    return ({
        isOpen, onOpenChange, 
        handleContextMenu, 
        handleClick
    })
}