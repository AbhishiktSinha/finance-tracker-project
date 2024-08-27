export const defaultCurrencySelector = ({userDoc})=>{
    const {settings: {defaultCurrency}} = {userDoc};

    return defaultCurrency;
}