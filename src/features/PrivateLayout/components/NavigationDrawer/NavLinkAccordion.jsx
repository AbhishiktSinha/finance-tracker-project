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

    const [accordionIsOpen, setAccordionIsOpen] = useState(false);


    function toggleAccordion(e) {
        e.preventDefault();
        e.stopPropagation();

        setAccordionIsOpen( value => !value );
    }

    return (
        <div className={"accordion-container" + (accordionIsOpen ? ' isOpen' : ' isClosed')}>
            <li key={'nav-link-accordion-'+route_key} 
                className={"nav-link-item-contianer nav-accordion-header-item-container" + (accordionIsOpen ? ' open' : ' closed') }>
                
                <p className="accordion-header" onClick={toggleAccordion}>

                    {/* ----- icon ----- */}
                    { getRouteIcon(route_key, 'default') }
                    {/* {getRouteIcon(route_key, drawerOpen ? 'active' : 'default')} */}

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
                                    {accordionIsOpen ? <ExpandLess /> : <ExpandMore />}
                                </span>
                            </>
                        ) :
                        // drawer is closed
                        (
                            // ----------- accordion-arrow ----------
                            <span className="accordion-action">
                                {accordionIsOpen ? <ExpandLess /> : <ExpandMore />}
                            </span>
                        )
                    }
                </p>

            </li>
            
            {
                accordionIsOpen && (
                    <div className="accordion-content">
                        {
                            children
                        }
                    </div>
                )
            }
        </div>
    )
}