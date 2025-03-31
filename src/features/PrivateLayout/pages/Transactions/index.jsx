import { useContext, useEffect, useRef, useState } from "react";

import FilterConditionsContextProvider from "./context/FilterConditionsContext/Provider";
import TransationsInitializerContextProvider from "./context/TransactionsInitializerContext/Provider";
import statusContext from "../../components/StateInitializer/context";
import onboardingStatusContext from "../../components/OnboardingAction/context";

import TransactionsListContainer from './components/TransactionsListContainer/index.jsx';

import { Button, Input } from "antd";
import { UploadFileOutlined } from "@mui/icons-material";
import { Skeleton } from "@mui/material";

import { checkDisplayUI } from "../../utils";


import './styles.scss'
import SearchQueryContextProvider from "./context/SearchQueryContext/Provider.jsx";
import SortOrderContextProvider from "./context/SortOrderContext/Provider.jsx";
import MastHead from "./components/MastHead/index.jsx";

export default function Transactions() {
    
    const filterModalRef = useRef();

    const { status: initialStateStatus } = useContext(statusContext);
    const { isOnboardingDone } = useContext(onboardingStatusContext)

    // #region DEPRECATED handling search query from context now
    /* const [query, setQuery] = useState('');

    const onInputChange = debounce((e)=>{setQuery(e.target.value)}, 240); */
    // #endregion

    
    const showUI = checkDisplayUI([initialStateStatus], isOnboardingDone);
    
    function openFilterModal() {
        filterModalRef.current.openModal();
    }    
    
    // CONDITIONAL SKELETON RENDER
    if (!showUI) {
        return <Skeleton />
    }


    return (
        <FilterConditionsContextProvider>

            <TransationsInitializerContextProvider >

                <SortOrderContextProvider>

                    <SearchQueryContextProvider>

                        <div className="route-page" id="transactions-page">
                            <div className="page-contents-wrapper">

                                {/* <div className="page-title-bar">
                                    <h1 className="page-title">Transactions</h1>

                                    <Button shape="round" type="primary-inverted">
                                        <UploadFileOutlined />
                                        Export
                                    </Button>
                                </div> */}

                                <MastHead />
                                
                                <TransactionsListContainer />

                            </div>
                        </div>

                    </SearchQueryContextProvider>

                </SortOrderContextProvider>


            </TransationsInitializerContextProvider>

        </FilterConditionsContextProvider>
    )
    
}