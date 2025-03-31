import {useState, useEffect} from 'react';

export default function useIsScreenMaxWidth(threshold) {
    
    const maxWidth = Number(threshold);

    const [isBelowThreshold, setIsBelowThreshold] = useState( ()=>(window.innerWidth < maxWidth) )


    useEffect(()=>{

        const resizeHandler = (e)=>{
            
            if (e.target.innerWidth < maxWidth) {
                setIsBelowThreshold(true)
            }
            else if (e.target.innerWidth >= maxWidth) {
                setIsBelowThreshold(false)
            }
        }

        window.addEventListener('resize', resizeHandler);

        return ()=>{
            window.removeEventListener('resize', resizeHandler)
        }

    }, [])


    return isBelowThreshold;
}