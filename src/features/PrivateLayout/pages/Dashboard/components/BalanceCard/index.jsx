import { useSelector } from 'react-redux';

import { selectBalance, selectDefaultCurrency } from '../../../../redux/selectors';
import { selectNewTransactionData_balance } from '../../redux/selectors';

import useDynamicAmount from '../../../../../../custom_hooks/useDynamicAmount';
import { consoleDebug, consoleInfo } from '../../../../../../console_styles';
import { checkDisplayUI } from '../../../../utils';

import DashboardTransactionCard from '../DashboardTransactionCard';
import './styles.css'
import { asyncStatus } from '../../../../../../enums';

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

    consoleDebug('------ BALANCE CARD RENDERD --------')
    
    const initializer = useSelector(selectBalance);
    const defaultCurrency = useSelector(selectDefaultCurrency);
    const newTransactionData = useSelector(selectNewTransactionData_balance);

    consoleInfo(`BALANCE CARD DEPENDENCIES:\n
        initializer: ${JSON.stringify(initializer)}\n
        defaultCurrency: ${JSON.stringify(defaultCurrency)}\n
        newTransactions: ${JSON.stringify(newTransactionData)}`)

    const {status, data: amount, error} = useDynamicAmount(
        initializer, 
        defaultCurrency.code, 
        newTransactionData);

    consoleDebug(`BALANCE CARD STATUS: ${status}\n
        BALANCE CARD AMOUNT: ${amount}`);

    const showCardUI = checkDisplayUI([status]);


    return (
        
        <DashboardTransactionCard 
            rootClassname={'balance-card'}
            id={'balance_card'}
            title={'balance'}
            showUI={showCardUI}
            
            data={{
                amount: amount, 
                defaultCurrency: defaultCurrency,                 
            }}
        />
    )
}