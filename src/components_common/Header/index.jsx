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
import { Button } from 'antd';
import { MenuRounded } from '@mui/icons-material';

    export default function Header({userAuthDetails: {userLoginStatus, user, error}, drawerActionsRef}) {    


        consoleInfo('-------HEADER PROP: drawerActionsRef -------------')
        console.log(drawerActionsRef)

        // to make header icon dynamically respond to change in width
        const [smallThreshold, setSmallThreshold] = useState(()=>{
            
            consoleInfo(`window.innerWidth: ${window.innerWidth}`);
            return window.innerWidth < 520 ? false : true; 
        });


        function openNavDrawer() {
            console.log(drawerActionsRef)
            drawerActionsRef.current.openDrawer();
        }
        function closeDrawer() {
            drawerActionsRef.current.closeDrawer();
        }

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
                <div className="header-left-container">
                    
                    <Button 
                        className='open-nav-drawer-button'
                        ghost
                        shape={'circle'}
                        onClick={openNavDrawer}
                    ><MenuRounded/></Button>

                <div className="logo-main-container">
                    <img className="logo-main" src={Logo_main} alt="financely" draggable={false} />
                    <img src={Logo_small} alt="Financely" className="logo-small" draggable={false}/>
                </div>

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