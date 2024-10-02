import CardDetailsSkeleton from '../CardDetailsSkeleton'

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

    if (!showUI) {
        return (
            <div 
            className= {`dashboard-card dashboard-skeleton-card${rootClassname}`}
        >
            <div className="card-header card-header-skeleton">
                {title}                
            </div>    

            <div className='card-details card-details-skeleton'>
                    
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
            className= {`dashboard-card ${rootClassname}`}
            id={id} 
            title={title}
            style={styles}
        >
            <div className="card-header">
                {title}
                {
                    timeframe && (
                        <div className="timeframe-details">
                            This <span className="timeframe">{timeframe}</span>
                        </div>
                    )
                }
            </div>

            {chart && <div className="transaction-chart"></div>}

            <div className='card-details'>
                
                <div className="defaultCurrency" title={defaultCurrency.code}>
                    <span>
                        {defaultCurrency.symbol}
                    </span>
                </div>

                <div className="amount">{amount}</div>                

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