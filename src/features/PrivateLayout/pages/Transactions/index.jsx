import { useContext, useEffect, useRef } from "react";

import { Skeleton } from "@mui/material";

import FilterConditionsContextProvider from "./context/FilterConditionsContext/Provider";
import TransationsInitializerContextProvider from "./context/TransactionsInitializerContext/Provider";
import statusContext from "../../components/StateInitializer/context";
import onboardingStatusContext from "../../components/OnboardingAction/context";

import FilterModal from "./components/FilterModal";

import ModalWrapper from "../../../../components_common/ModalWrapper";

import { checkDisplayUI } from "../../utils";


import './styles.scss'
import { Button } from "antd";
import { Filter, Filter2, FilterAltOutlined } from "@mui/icons-material";

export default function Transactions() {
    
    const filterModalRef = useRef();

    const { status: initialStateStatus } = useContext(statusContext);
    const { isOnboardingDone } = useContext(onboardingStatusContext)

    const showUI = checkDisplayUI([initialStateStatus], isOnboardingDone);
    
    function openFilterModal() {
        filterModalRef.current.openModal();
    }
    
    useEffect(()=>{
        if (showUI) {
            filterModalRef.current.openModal();
        }
        
    }, [showUI])
    
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
                        </div>

                        <Button onClick={openFilterModal}><FilterAltOutlined /></Button>

                        <ModalWrapper ref={filterModalRef} className='transactions-filter-modal-container'>
                            <FilterModal />
                        </ModalWrapper>
                    </div>
                </div>
            </TransationsInitializerContextProvider>


        </FilterConditionsContextProvider>
    )
    
}