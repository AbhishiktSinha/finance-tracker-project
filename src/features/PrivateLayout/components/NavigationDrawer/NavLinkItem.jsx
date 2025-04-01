import { DashboardRounded, DashboardOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';


export default function NavLinkItem({title, showTitle, route, isSelected, defaultIcon, activeIcon, children, onClick}) {
    

    return (
        <li className="navigation-link-item-container">

            <Link to={route} 
                className={isSelected?'nav-link selected':'nav-link'} 
                {...onClick && {onClick: onClick}}
            >
                {
                    // <span className='nav-link-icon'></span>

                        isSelected ? activeIcon : defaultIcon
                }

                {
                    showTitle && <span className="nav-link-title">{title}</span>
                }
                {
                    children
                }
            </Link>
        </li>
    )

}