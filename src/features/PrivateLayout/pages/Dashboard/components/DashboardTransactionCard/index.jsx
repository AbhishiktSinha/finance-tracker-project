import CardDetailsSkeleton from '../CardDetailsSkeleton'

import './styles.css'

export default function DashboardTransactionCard({
    rootClassname, id, title, orientation, styles,
    defaultCurrency, amount, insights, additional,
    chart
}) {

    return (
        <div 
            className= {`dashboard-card ${rootClassname}`}
            id={id} 
            title={title}
            style={styles}
        >
            <div className="card-header">
                {title}
            </div>

            {chart && <div className="transaction-chart"></div>}

            <div className='card-details'>

                {
                    (defaultCurrency == 'loading' || defaultCurrency == 'pending') ?
                        (
                            <CardDetailsSkeleton
                                className="defaultCurrency-skeleton"
                            />
                        ) :
                        (
                            <div className="defaultCurrency" title={defaultCurrency.code}>
                                <span>
                                    {defaultCurrency.symbol}
                                </span>
                            </div>
                        )
                }

                {
                    amount == 'loading' || amount == 'pending' ?
                        (
                            <CardDetailsSkeleton
                                className='amount-skeleton'
                            />
                        ) :
                        (
                            <div className="amount">{amount}</div>
                        )
                }

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