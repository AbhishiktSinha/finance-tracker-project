import { useSelector } from 'react-redux';

import { checkDisplayUI } from '../../../../utils';
import { selectBalance, selectDefaultCurrency, selectNewTransaction } from '../../../../redux/selectors';
import { useDynamicAmount } from '../../../../../../custom_hooks';

import DashboardTransactionCard from '../DashboardTransactionCard';
import './styles.css'
/**
 * # TODO: 
 *What do we envision for the BalanceCard ?  
 *### ESSENTIAL  
 *- show the balance amount  
 *- show an info chip displaying this weeks change in balance ([down] 10%)  
 *- show the default currency  
 *- open the balance and transactions page on click  
 *### ORNAMENTAL  
 *- show the last week's transactions in a vertical carousel  
 *OR  
 *- show the balance portions in different currencies in a carousel  
 * 
 */

export default function BalanceCard() {

    const initializer = useSelector(selectBalance);
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransaction = useSelector(selectNewTransaction);

    const {status, data, error} = useDynamicAmount(initializer, defaultCurrency.code, newTransaction);

    const showCardUI = checkDisplayUI([status]);


    return (
        
        <DashboardTransactionCard 
            rootClassname={'balance-card'}
            id={'balance_card'}
            title={'balance'}
            showUI={showCardUI}
            
            data={{
                amount: data, 
                defaultCurrency: defaultCurrency,                 
            }}
        />
    )
}