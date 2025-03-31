import IncomeOutlined from '@assets/income-mui-outlined.png'
import IncomeRounded from '@assets/income-mui-rounded.png'
import ExpenditureOutlined from '@assets/expenditure-mui-outlined.png'
import ExpenditureRounded from '@assets/expenditure-mui-rounded.png'
import CashOutDefault from '@assets/cash-out-default.png';
import CashOutActive from '@assets/cash-out-active.png';
import CashInDefault from '@assets/cash-in-default.png'
import CashInActive from '@assets/cash-in-active.png'
import { consoleError } from '../../../../console_styles'
import { AccountBalanceWalletOutlined, AccountBalanceWalletRounded, BarChartOutlined, BarChartRounded, DashboardOutlined, DashboardRounded, ListAltOutlined, ListAltRounded } from '@mui/icons-material'
/**
 * 
 * @param {string} route dashboard | transactions | balance | income | expenditure | settings
 * @param {string} iconType default | active
 */
export function getRouteIcon(route, iconType) {    
    
    const selectIcon = (defaultIcon, activeIcon)=>{
        if (iconType == 'default') return defaultIcon;
        else if (iconType == 'active') return activeIcon;
        else {
            console.log('invalid icon type');
        }
    }
    switch(route) {

        case 'dashboard': {
            return selectIcon(<DashboardOutlined />, <DashboardRounded />);
            break;
        }
        case 'transactions': {
            return selectIcon(<ListAltOutlined />, <ListAltRounded />);
            break;
        }
        case 'analytics': {
            return selectIcon(<BarChartOutlined />, <BarChartRounded />)
            break;
        }
        case 'balance': {
            return selectIcon(<AccountBalanceWalletOutlined />, <AccountBalanceWalletRounded />);
            break;
        }
        case 'income' : {
            return selectIcon(
                <img src={CashInDefault} style={{height:'24px', width:'24px'}}/>,
                <img src={CashInActive} style={{height:'24px', width:'24px'}}/>
            )
            break;
        }
        case 'expenditure': {
            return selectIcon(
                <img src={CashOutDefault} style={{height:'24px', width:'24px'}}/>,
                <img src={CashOutActive} style={{height:'24px', width:'24px'}} />
            )
            break;
        }
        default: {
            consoleError('invalid route');
        }
    }
}