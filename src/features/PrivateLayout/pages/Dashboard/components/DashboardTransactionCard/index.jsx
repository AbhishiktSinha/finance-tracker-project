import { useCallback } from 'react';
import CardDetailsSkeleton from '../CardDetailsSkeleton'

import { consoleDebug, consoleError } from '../../../../../../console_styles';
import './styles.css'
import { asyncStatus, changeType } from '../../../../../../enums';
import { DashOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons';

/*TODO: 
OVERHAULING
change in the props of dashboard transaction card
Appropriate change in balance card

create separate jsx for skeleton card to show conditionally based on status
*/

export default function DashboardTransactionCard({
    rootClassname, id, title, orientation, styles,
    showUI, data, chart, insights,
}) {

    const { defaultCurrency, amount, timeframe } = data;
    consoleDebug(`Amount recieved in DashboardTransactionCard:  ${typeof amount} | ${amount}`);
    console.log('INSIGHT RECIEVED IN DashboardTransactionCard:', insights);

    const getDisplayAmount = useCallback((amount) => {
        consoleDebug(`calling getDisplayAmount()`)
        if (typeof amount == 'number') {

            consoleDebug('amount exists')
            if (amount === 0) {
                consoleDebug('amount == 0');
                return '00000';
            }
            else {
                return Number(amount.toFixed(0)).toLocaleString();
            }
        }

    }, [])

    if (!showUI) {
        return (
            <div
                className={`dashboard-card-skeleton ${rootClassname}`}
                id={`${rootClassname + '-skeleton'}`}
            >
                <div className="card-header-skeleton">
                    <p className="title">{title}</p>
                </div>

                <div className='card-details-skeleton'>

                    <CardDetailsSkeleton
                        className="defaultCurrency-skeleton"
                    />

                    <CardDetailsSkeleton
                        className='amount-skeleton'
                    />

                    {
                        insights && (

                            <CardDetailsSkeleton
                                className='insights-chip-skeleton'
                                round={true}
                            />

                        )
                    }
                </div>
            </div>
        )
    }

    return (
        <div
            className={`dashboard-card ${rootClassname}`}
            id={id}
            title={title}
            style={styles}
        >
            <div className="card-header">
                <p className="title">{title}</p>
                {
                    timeframe && (
                        <div className="timeframe-details">
                            This <span className="timeframe">{timeframe}</span>
                        </div>
                    )
                }
            </div>

            <div className='card-details'>

                <div className="defaultCurrency" title={defaultCurrency.code}>
                    <span>
                        {defaultCurrency.symbol}
                    </span>
                </div>

                <div className="amount-container">

                    {
                        insights && (

                            (insights.status == asyncStatus.INITIAL || insights.status == asyncStatus.LOADING) ?
                                (
                                    <CardDetailsSkeleton
                                        className='insights-chip-skeleton'
                                        round={true}
                                    />
                                ) :
                                (
                                    <div className="insights-chip">
                                        <span className="insights-change-indicator">
                                            {
                                                insights.data.changeType == changeType.POSITIVE && (
                                                    <RiseOutlined className='insights-change-indicator-icon' />
                                                )
                                            }
                                            {
                                                insights.data.changeType == changeType.NEGATIVE && (
                                                    <FallOutlined className='insights-change-indicator-icon' />
                                                )
                                            }
                                            {
                                                insights.data.changeType == changeType.NONE && (
                                                    <DashOutlined classID='insights-change-indicator-icon' />
                                                )
                                            }
                                        </span>

                                        <span className="change-value">
                                            {`${insights.data.value} ${insights.data.unit}`}
                                        </span>
                                    </div>
                                )
                        )
                    }
                        
                    {getDisplayAmount(amount)}
                </div>

                
            </div>
        </div>
    )
}