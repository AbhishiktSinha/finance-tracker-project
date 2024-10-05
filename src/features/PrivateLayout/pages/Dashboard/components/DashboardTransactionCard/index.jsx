import { useCallback } from 'react';
import CardDetailsSkeleton from '../CardDetailsSkeleton'

import { consoleDebug, consoleError } from '../../../../../../console_styles';
import './styles.css'

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

    const getDisplayAmount = useCallback((amount) => {
        consoleDebug(`calling getDisplayAmount()`)
        if (typeof amount == 'number') {

            consoleDebug('amount exists')
            if (amount === 0) {
                consoleDebug('amount == 0');
                return '00000';
            }
            else {
                return amount.toLocaleString();
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
                    {title}
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
                                className='insights-skeleton'
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

                <div className="amount">{getDisplayAmount(amount)}</div>

                {
                    insights && (

                        insights == 'loading' ?
                            (
                                <CardDetailsSkeleton
                                    className='insights-skeleton'
                                    round={true}
                                />
                            ) :
                            (
                                <></>
                            )
                    )
                }
            </div>
        </div>
    )
}