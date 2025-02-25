import { ExpandLess, ExpandMore, ExpandMoreRounded } from "@mui/icons-material"
import { getRouteIcon } from "./iconUtils" 
import { useState } from "react"
import { Link } from "react-router-dom";
import NavLinkItem from "./NavLinkItem";

/*  
    Accordion is only used to group the subroutes of an emptyCategoryLayout
    The accordion header which represents the category, is not a link in itself
    It's just the category title
*/


export default function NavLinkAccordion({route_key, title, drawerOpen, children}) {

    const [isOpen, setIsOpen] = useState(false);


    function toggleAccordion(e) {
        e.preventDefault();
        e.stopPropagation();

        setIsOpen( value => !value );
    }

    return (
        <>
            <li key={'nav-link-accordion-'+route_key} className={"nav-link-item-contianer nav-accordion-header-item-container" + (isOpen ? ' open' : ' closed') }>
                
                <p className="accordion-header" onClick={toggleAccordion}>

                    {/* ----- icon ----- */}
                    {getRouteIcon(route_key, drawerOpen ? 'active' : 'default')}

                    {drawerOpen ?
                        // drawer is open
                        (
                            <>
                                {/* ---- title ---- */}
                                <span className="nav-link-title nav-link-accordion-title">
                                    {title}
                                </span>

                                {/* --- accordion-arrow --- */}
                                <span className="accordion-action">
                                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                                </span>
                            </>
                        ) :
                        // drawer is closed
                        (
                            <span className="accordion-action">
                                {isOpen ? <ExpandLess /> : <ExpandMore />}
                            </span>
                        )
                    }
                </p>

                {
                    isOpen && drawerOpen && (
                        <div className="accordion-content">
                            {
                                children
                            }
                        </div>
                    )
                }
            </li>
        </>
    )
}