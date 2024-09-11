import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import { selectBalanceCardData } from './redux/selectors';
import { consoleDebug } from '../../../../../../console_styles';

import './styles.css'
import DashboardTransactionCard from '../DashboardTransactionCard';
import { convertToDefaultCurrency } from '../../utils';
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
 *          OR
 *      - show the balance portions in different currencies in a carousel
 * 
 */

export default function BalanceCard() {

    const data = useSelector(selectBalanceCardData);
    const {defaultCurrency: {code: currencyCode, symbol: currencySymbol}, transactions} = data;
    
    console.log('BALANCE CARD', data, currencyCode, currencySymbol);
    
    // balance is stateful for conversion
    /* INtial render -> loading 
        post render -> conversion
        post conversion -> set converted value
    */
    const [balance, setBalance] = useState('loading');

    useEffect(()=>{
        consoleDebug(`BalanceCard defaultCurrency changed: ${data.defaultCurrency}`);

        console.log('balance:',balance, data.balance);

        // we have to compute the values
        if (data.defaultCurrency != 'pending') {

            // display the amount skeleton while conversion takes place
            balance != 'loading' && setBalance('loading');

            const balanceConverted = convertToDefaultCurrency(data.defaultCurrency.code, data.balance);
            setBalance(balanceConverted === 0 ? '00000' : balanceConverted.toFixed(0));
        }

        // onboarding steps pending
        if (data.defaultCurrency == 'pending') {
            // do nothing, wait for OnboardingModal to do its job
        }
        
    }, [data.defaultCurrency])

    return (
        
        <DashboardTransactionCard 
            rootClassname={'balance-card'}
            id={'balance_card'}
            title={'balance'}
            
            defaultCurrency={data.defaultCurrency}
            amount={balance}
        />
    )
}