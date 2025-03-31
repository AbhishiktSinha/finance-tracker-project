import { useContext, useState } from "react";

import { ArrowBackRounded, SearchOutlined } from "@mui/icons-material";
import { Button, Input } from "antd";

import SearchQueryContext from "../../context/SearchQueryContext";

import './styles.scss'


export default function SearchTransactions({isOpen, openSearch, closeSearch}) {

    const {setQuery} = useContext(SearchQueryContext)    

    function handleChange(e) {
        setQuery(e.target.value);
    }

    return (
        <>
            <div className={"search-bar-container" + " " + (isOpen?"open": "")}>                
                    <Button 
                        className="close-search-button"
                        onClick={()=>closeSearch()}
                        shape={'circle'}
                    >
                        <ArrowBackRounded />
                    </Button>

                    <Button 
                        className="open-search-button" 
                        onClick={() => { openSearch() }}
                        shape={"circle"}
                    >
                        <SearchOutlined />
                    </Button>   

                    <Input
                        className="search-transactions-input"
                        variant="filled"
                        prefix={<SearchOutlined />}
                        placeholder="Search"                        
                        onChange={handleChange}
                    />

            </div>    
        </>
    )
}