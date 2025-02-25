import { useRef, useState } from 'react';

import { AccountBalanceOutlined, AccountBalanceRounded, AccountBalanceWalletOutlined, AccountBalanceWalletRounded, BalanceOutlined, BarChartOutlined, BarChartRounded, DashboardOutlined, DashboardRounded, HistoryOutlined, HistoryRounded, ListAltOutlined, ListAltRounded } from '@mui/icons-material';

import { Link, useLocation, useParams } from 'react-router-dom';

import defaults from '../../defaults';
import './styles.scss'
import NavLinkItem from './NavLinkItem';
import ROUTES from '../../../../routes.config';
import { getRouteIcon } from './iconUtils';
import NavLinkAccordion from './NavLinkAccordion';
// import ROUTES from '../../../../routes.config';

export default function NavigationDrawer() {

    const [drawerState, setDrawerState] = useState('closed');
    const openTrigger = useRef(false)

    const location = useLocation();
    const {pathname} = location;
    
    console.log('location:', location)
    

    const {main: {settings, ...main_routes}} = ROUTES;

    function onMouseOver(e) {
        
        openTrigger.current = true;

        setTimeout(()=>{
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
            <ul className="navigation-drawer-list">
                
                {
                    Object.keys(main_routes).map(
                        (route_key)=>{
                            
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
                                
                                const {__index__, emptyCategoryLayout, __route__, ...nested_routes} = main_routes[route_key]                                
                                
                                return (
                                    <NavLinkAccordion
                                        key={'nav-link-accordion/'+route_key}
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

    /* return (
        <div 
            className={'navigation-drawer' + " " + drawerState} 
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            
            <ul className="navigation-drawer-list">
                <li 
                    className="navigation-link-item-container"
                    key='dashboard-link-item'
                >

                    <Link to={'#'} 
                        className={getClassName('dashboard')}>
                        {
                            isSelected('dashboard') ? <DashboardRounded /> : <DashboardOutlined />
                        }
                        
                        {
                            drawerState == 'open' && (
                                <span>Dashboard</span>
                            )
                        }
                    </Link>
                </li>

                <li key={'transactions-link-item'} className='navigation-link-item-container'>
                    <Link to={'#'} className={getClassName('transactions')}>
                        {
                            isSelected('transactions') ?
                                <ListAltRounded /> :
                                <ListAltOutlined />
                        }
                        {
                            drawerState == 'open' && (
                                <span>Transactions</span>
                            )
                        }
                    </Link>
                </li>

                <li className="navigation-link-item-container
                ">
                    <Link to={'#'} className={getClassName('analytics')}>
                        {
                            isSelected('analytics') ?
                                <BarChartRounded /> :
                                <BarChartOutlined />
                        }
                        {
                            drawerState == 'open' && (
                                <span>Analytics</span>
                            )
                        }
                    </Link>
                </li>


                <li className="navigation-link-item-container
                ">
                    <Link to={'#'} >
                        {
                            isSelected('balance') ? 
                                <AccountBalanceWalletRounded /> :
                                <AccountBalanceWalletOutlined />
                        }
                        {
                            drawerState == 'open' && (
                                <span>Balance</span>
                            )
                        }
                    </Link>
                </li>
            </ul>
        </div>
    ) */
}