export const selectDefaultCurrency = ({userDoc})=>{
    
    return userDoc.data?.settings?.defaultCurrency;
}

export const selectStatus = ({userDoc})=> {
    return userDoc.status;
}