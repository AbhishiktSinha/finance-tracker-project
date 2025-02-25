import { useState, useEffect, useMemo } from 'react'

import { Skeleton } from '@mui/material';

import AvatarComponent from '../AvatarComponent';
import QuickActionsIsland from './components/QuickActionsIsland'
import NavbarActionsContainer from './components/NavbarActionsContainer'

import Logo_main from '../../assets/logo-main.png'
import Logo_small from '../../assets/logo-small.png'
import { consoleInfo } from '../../console_styles';

import './styles.scss'
import { asyncStatus } from '../../enums';

export default function Header({userAuthDetails: {userLoginStatus, user, error}}) {    

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
                Boolean(userLoginStatus != asyncStatus.ERROR) && (
                    (() => {

                        return (

                            <div className="header-right-container">

                                <NavbarActionsContainer userLoginStatus = {userLoginStatus} />

                                {
                                    (userLoginStatus == asyncStatus.LOADING || userLoginStatus == asyncStatus.INITIAL) ? 
                                        (
                                            <Skeleton variant='circular' className='avatar-skeleton' />
                                            
                                        ) : 
                                        (
                                            <AvatarComponent
                                                shape='circle'
                                                size={'default'}
                                                displayName={user.displayName}
                                                photoUrl={user.photoUrl}
                                                email={user.email}
                                            />
                                        )
                                }
                                
                            </div>
                        )
                    }
                    )()
                )

            }
        </div>
    )
}