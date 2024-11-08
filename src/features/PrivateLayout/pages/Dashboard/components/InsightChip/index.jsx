import { useContext } from "react";
import useInsightState from "../../../../../../custom_hooks/useInsightState";
import { asyncStatus, changeType as changeTypeEnum } from "../../../../../../enums";
import { getChangeType, getValueChangePercentage } from "../../../../utils";
import CardDetailsSkeleton from "../CardDetailsSkeleton";
import { useSelector } from "react-redux";
import userAuthContext from "../../../../context/userAuthContext";
import { DashOutlined, FallOutlined, RiseOutlined } from "@ant-design/icons";

export default function InsightChip({ aggregateTransactionAmt, activeTimeframe, 
    defaultCurrencyCode, type }) {
          
        const newTransactionData = useSelector( ({newTransaction})=> {

            if ( Boolean(newTransaction.id) ) {

                return ( newTransaction.data.type == type ? 
                    newTransaction.data : 
                    undefined
                );
            }
        })

        const {status, 
            data,
            error} = useInsightState( activeTimeframe, defaultCurrencyCode, newTransactionData, type)

        

        if (status == asyncStatus.INITIAL || status == asyncStatus.LOADING) {
            return (
                <CardDetailsSkeleton
                    className='insights-chip-skeleton'
                    round={true}
                />
            )
        }
        else if (status == asyncStatus.SUCCESS) {

            const changeType = getChangeType(data.amount, aggregateTransactionAmt);
            const changeValue = getValueChangePercentage(data.amount, aggregateTransactionAmt) 

            return (

                <div className="insights-chip">
                    <span className="insights-change-indicator">
                        {
                            changeType == changeTypeEnum.POSITIVE && (
                                <RiseOutlined className='insights-change-indicator-icon' />
                            )
                        }
                        {
                            changeType == changeTypeEnum.NEGATIVE && (
                                <FallOutlined className='insights-change-indicator-icon' />
                            )
                        }
                        {
                            changeType == changeTypeEnum.NONE && (
                                <DashOutlined classID='insights-change-indicator-icon' />
                            )
                        }
                    </span>
    
                    <span className="change-value">
                        {`${changeValue.toFixed()} %`}
                    </span>
                </div>
            )

        } 
        else {
            return <></>
        }       
    }