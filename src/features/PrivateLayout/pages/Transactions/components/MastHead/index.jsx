import { useState } from "react";
import SearchTransactions from "../SearchTransactions";
import FilterButton from "../FilterButton";
import SortButton from "../SortButton";

import './styles.scss'

export default function MastHead() {

    const [isSearchOpen, setIsSearchOpen] = useState(false)


    function openSearch() {
        setIsSearchOpen(true)
    }
    function closeSearch() {
        setIsSearchOpen(false)
    }

    return (
        <header className={"page-masthead" + (isSearchOpen? " search-open" : "")} id="transactions_page_masthead">

            <h1 className="page-title">Transactions</h1>

            <div className={"masthead-actions-container"}>
                <SearchTransactions 
                    isOpen={isSearchOpen}
                    openSearch={openSearch}
                    closeSearch={closeSearch}
                />

                <FilterButton />

                <SortButton />
            </div>            
        </header>
    )
}