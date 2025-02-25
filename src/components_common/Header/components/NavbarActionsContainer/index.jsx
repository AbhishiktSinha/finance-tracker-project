import { useContext } from "react";
import { Skeleton } from "@mui/material";

import DefaultCurrencyActionButton from '../DefaultCurrencyActionButton/index.jsx'
import NotificationsActionButton from '../NotificationsActionButton/index.jsx'

import { asyncStatus } from "../../../../enums.js";
import './styles.scss'

export default function NavbarActionsContainer({userLoginStatus: status}) {    
    

    return (
        <div className="navbar-actions-container">
            {
                status == asyncStatus.LOADING || status == asyncStatus.INITIAL && (
                    <>
                        <div className="navbar-action-button-skeleton" key={'nav-action-skeleton-1'}>
                            <Skeleton className="skeleton-content" variant='circular' />
                        </div>
                        <div className="navbar-action-button-skeleton" key={'nav-action-skeleton-2'}>
                            <Skeleton className="skeleton-content" variant='circular' />
                        </div>
                        <div className="navbar-action-button-skeleton" key={'nav-action-skeleton-3'}>
                            <Skeleton className="skeleton-content" variant='circular' />
                        </div>                        
                    </>
                )
            }
            {
                status == asyncStatus.SUCCESS && (
                    <>
                        <DefaultCurrencyActionButton />
                        <NotificationsActionButton />
                    </>
                )
            }
        </div>
    )
}