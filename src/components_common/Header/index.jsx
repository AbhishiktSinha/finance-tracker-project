import { useState, useEffect, useMemo } from 'react'

import AvatarComponent from '../AvatarComponent';

import Logo_main from '../../assets/logo-main.png'
import Logo_small from '../../assets/logo-small.png'
import { consoleInfo } from '../../console_styles';

import './styles.css'

export default function Header({userDetails}) {    

    // to make header icon dynamically respond to change in width
    const [smallThreshold, setSmallThreshold] = useState(()=>{
        
        consoleInfo(`window.innerWidth: ${window.innerWidth}`);
        return window.innerWidth < 520 ? false : true; 
    });

    // handle window resize event in effect
    useEffect(()=>{
        const resizeHandler = (e)=>{
            consoleInfo('window resize event');

            if (e.target.innerWidth <= 520) {
                setSmallThreshold(false);
            }
            else if(e.target.innerWidth > 520) {
                setSmallThreshold(true);
            }
        }
        window.addEventListener('resize', resizeHandler);

        return ()=>{
            window.removeEventListener('resize', resizeHandler);
        }
    }, [])


    return (
        <div id="header">
            <div className="logo-main-container">
                <img className="logo-main" 
                    src={smallThreshold ? Logo_main : Logo_small} 
                    alt="financely" 
                    draggable={false}
                    />
            </div>
            {
                Boolean(userDetails) && (
                    (() => {
                        const { displayName, email, photoUrl } = userDetails;

                        return (

                            <div className="header-right-container">

                                <AvatarComponent
                                    shape='circle'
                                    size='default'
                                    displayName={displayName}
                                    photoUrl={photoUrl}
                                    email={email}
                                />
                            </div>
                        )
                    }
                    )()
                )

            }
        </div>
    )
}