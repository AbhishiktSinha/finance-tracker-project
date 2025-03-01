import { useContext, useEffect, useRef } from "react";

import { Skeleton } from "@mui/material";

import FilterConditionsContextProvider from "./context/FilterConditionsContext/Provider";
import TransationsInitializerContextProvider from "./context/TransactionsInitializerContext/Provider";
import statusContext from "../../components/StateInitializer/context";
import onboardingStatusContext from "../../components/OnboardingAction/context";

import FilterModal from "./components/FilterModal";
// import FilterDisplaySection from './components/FilterDisplaySection/index.jsx'

import ModalWrapper from "../../../../components_common/ModalWrapper";

import { checkDisplayUI } from "../../utils";


import './styles.scss'
import { Button, Input } from "antd";
import { FilterAltOutlined, FilterAltRounded, FilterListRounded, UploadFileOutlined } from "@mui/icons-material";
import { SearchOutlined } from "@ant-design/icons";

export default function Transactions() {
    
    const filterModalRef = useRef();

    const { status: initialStateStatus } = useContext(statusContext);
    const { isOnboardingDone } = useContext(onboardingStatusContext)

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

                <div className="route-page" id="transactions-page">
                    <div className="page-contents-wrapper">

                        <div className="page-title-bar">
                            <h1 className="page-title">Transactions</h1>

                            <Button shape="round" type="primary-inverted">
                                <UploadFileOutlined />
                                Export
                            </Button>
                        </div>


                        <div className="transactions-list-container">

                            <header className="transactions-list-header">
                                <div className="search-transactions-container">
                                    <Input className="search-transactions-input" variant="filled" prefix={<SearchOutlined />} placeholder="Search"/>
                                </div>

                                <Button 
                                    className="transactions-filter-button transactions-action-button"
                                    shape="round"
                                    onClick={openFilterModal}
                                >
                                    <FilterAltRounded />
                                    Filter
                                </Button>
                                <Button 
                                    className="transactions-order-button transactions-action-button"
                                    shape="round"
                                >
                                    <FilterListRounded />
                                    Sort
                                </Button>

                            </header>

                            
                        </div>                        

                        <ModalWrapper ref={filterModalRef} className='transactions-filter-modal-container'>
                            <FilterModal />
                        </ModalWrapper>
                    </div>
                </div>
            </TransationsInitializerContextProvider>


        </FilterConditionsContextProvider>
    )
    
}