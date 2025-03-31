import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { Button } from 'antd';
import { CloseRounded } from '@mui/icons-material';

import NavLinkItem from './NavLinkItem';
import { getRouteIcon } from './iconUtils';
import NavLinkAccordion from './NavLinkAccordion';
// import ROUTES from '../../../../routes.config';

import LogoMain from '../../../../../assets/logo-main.png';
import ROUTES from '../../../../routes.config';

import './styles.scss'



const NavigationDrawer = forwardRef((props, ref) => {

    const [drawerState, setDrawerState] = useState('closed');
    // const [drawerState, setDrawerState] = useState('open');

    const openTrigger = useRef(false)

    const location = useLocation();
    const { pathname } = location;

    console.log('location:', location)

    
    useImperativeHandle(ref, ()=>{
        return {
            openDrawer: ()=>{setDrawerState('open')},
            closeDrawer: ()=>{setDrawerState('closed')}
        }
    }, [])
    

    const { main: { settings, ...main_routes } } = ROUTES;

    function onMouseOver(e) {

        openTrigger.current = true;

        setTimeout(() => {
            if (openTrigger.current == true) {
                setDrawerState('open')
            }
        }, 300)
    }
    function onMouseLeave(e) {
        openTrigger.current = false;
        if (drawerState == 'open') {
            setDrawerState('closed');
        }
    }

    function isSelected(link) {

        if (link == 'dashboard') {
            return (pathname == '/' || pathname.endsWith(link))
        }
        else return pathname.endsWith(link);
    }
    function getClassName(link) {

        if (isSelected(link)) return 'nav-link selected';
        else return 'nav-link'
    }

    return (
        <div
            className={"navigation-drawer" + " " + drawerState}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >

            {/* ------------------ HEADER -------------- */}
            <div className="navbar-top-container">
                <span className="logo-main-container">
                    <img src={LogoMain} alt="Financely" className="logo-main" />
                </span>
                <Button 
                    className='close-navbar-button'
                    shape={'circle'}
                    ghost
                    onClick={()=>{setDrawerState('closed')}}
                >
                    <CloseRounded />
                </Button>
            </div>
            
            {/* --------------- LIST OF NAVIGABLE LINKS ---------------- */}
            <ul className="navigation-drawer-list">

                {
                    Object.keys(main_routes).map(
                        (route_key) => {

                            if (route_key.startsWith('__')) return;

                            if (typeof main_routes[route_key] == 'string') {

                                const route = main_routes[route_key];

                                console.log(route, route_key);

                                return (
                                    <NavLinkItem
                                        key={route}
                                        title={route_key}
                                        route={route}
                                        showTitle={drawerState == 'open'}
                                        isSelected={pathname.endsWith(route)}
                                        defaultIcon={getRouteIcon(route_key, 'default')}
                                        activeIcon={getRouteIcon(route_key, 'active')}
                                    />
                                )
                            }
                            else if (typeof main_routes[route_key] == 'object' && main_routes[route_key].emptyCategoryLayout) {

                                const { __index__, emptyCategoryLayout, __route__, ...nested_routes } = main_routes[route_key]

                                return (
                                    <NavLinkAccordion
                                        key={'nav-link-accordion/' + route_key}
                                        route_key={route_key}
                                        title={route_key}
                                        drawerOpen={drawerState == 'open'}
                                    >
                                        {
                                            Object.keys(nested_routes).map(
                                                nestedRouteKey => {

                                                    if (typeof nested_routes[nestedRouteKey] == 'string') {

                                                        const nestedRoute = nested_routes[nestedRouteKey]

                                                        console.log(nestedRoute, nestedRouteKey);

                                                        return (
                                                            <NavLinkItem
                                                                key={nestedRoute}
                                                                title={nestedRouteKey}
                                                                showTitle={drawerState == 'open'}
                                                                route={nestedRoute}
                                                                isSelected={pathname.endsWith(nestedRoute)}
                                                                defaultIcon={getRouteIcon(nestedRouteKey, 'default')}
                                                                activeIcon={getRouteIcon(nestedRouteKey, 'active')}
                                                            />
                                                        )
                                                    }
                                                }
                                            )
                                        }
                                    </NavLinkAccordion>
                                )
                            }
                        }
                    )
                }

            </ul>
        </div>
    )

})



export default NavigationDrawer;