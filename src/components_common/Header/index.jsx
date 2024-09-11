import { useState, useEffect, useMemo } from 'react'

import { Skeleton } from 'antd';

import AvatarComponent from '../AvatarComponent';
import QuickActionsIsland from './components/QuickActionsIsland'

import Logo_main from '../../assets/logo-main.png'
import Logo_small from '../../assets/logo-small.png'
import { consoleInfo } from '../../console_styles';

import './styles.css'

export default function Header({userAuthDetails}) {    

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
                Boolean(userAuthDetails) && (
                    (() => {

                        return (

                            <div className="header-right-container">

                                {/* quick actions island */}
                                {
                                    (userAuthDetails == 'loading') ?
                                        (
                                            /* quickActions island skeleton */
                                            <Skeleton
                                                paragraph={false}
                                                title={true}
                                                round={true}
                                                rootClassName='quick-actions-island-skeleton'
                                                active
                                            />
                                        ) :
                                        (
                                            <QuickActionsIsland/>
                                        )
                                }
                                {/* avatar  */}
                                {
                                    (userAuthDetails == 'loading') ? 
                                        (
                                            <Skeleton
                                                paragraph={false}
                                                title={false}
                                                avatar={true} 
                                                round
                                                active
                                                rootClassName='avatar-skeleton'
                                            />
                                        ) : 
                                        (
                                            <AvatarComponent
                                                shape='circle'
                                                size={'default'}
                                                displayName={userAuthDetails.displayName}
                                                photoUrl={userAuthDetails.photoUrl}
                                                email={userAuthDetails.email}
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