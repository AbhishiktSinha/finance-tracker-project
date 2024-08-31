import { useEffect, useState } from 'react'


import CardDetailsSkeleton from '../CardDetailsSkeleton';
import './styles.css'
/**
 * TODO: 
 *      What do we envision for the BalanceCard ? 
 *      ESSENTIAL
 *      - show the balance amount
 *      - show an info chip displaying this weeks change in balance ([down] 10%)
 *      - show the default currency
 *      - open the balance and transactions page on click
 *      ORNAMENTAL ()
 *      - show the last week's transactions in a vertical carousel
 * 
 */
/* TODO: create DashboardTransactionCard component, refer to notebook */

export default function BalanceCard() {
    
    const [balanceDetails, setBalanceDetails] = useState({
        amount: 'loading',
        defaultCurrency: 'loading',
        insights: 'loading'
    })


    const {amount, defaultCurrency, insights} = balanceDetails;

    return (
        <div className="dashboard-card" id="balance_card" title='Balance'>
            <div className="card-header">
                balance
            </div>

            <div className="card-details balance-details">
                
                {
                    defaultCurrency=='loading' ? 
                        (
                            <CardDetailsSkeleton 
                                className="defaultCurrency-skeleton"
                            />
                        ) : 
                        (
                            <div className="defaultCurrency">
                                {defaultCurrency}
                            </div>
                        )
                }

                {
                    amount=='loading' ? 
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

                        insights=='loading' ? 
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