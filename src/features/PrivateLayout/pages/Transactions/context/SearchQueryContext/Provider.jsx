import { useState } from "react";
import SearchQueryContext from ".";
import { debounce } from "../../../../utils";


export default function SearchQueryContextProvider({ children }) {

    const [query, setQuery] = useState('');

    const setSearchQuery = debounce((value)=>setQuery(value), 150)

    return (
        <SearchQueryContext.Provider value={{
            query: query,
            setQuery: setSearchQuery
        }} >
            {children}
        </SearchQueryContext.Provider>
    )
}