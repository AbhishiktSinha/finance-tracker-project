
const style = {
    
    info: [
        "background-color: #1255cc",
        "padding-inline: 8px",
        "border-radius: 4px;",
        "color: #fff",        
        "font-family: 'Calibri'",
        "font-size: 16px"
    ].join(";"), 

    error: [
        "color: #ff5555",
        "font-weight: 500",
        "font-size: 14px"
    ].join(";"),

    success: [
        "color: #44ff88",
        "font-size: 14px"
    ].join(";"),

    debug : [
        "color: #000",
        "background-color: #ffff44",
        "padding-inline: 8px",
        "border-radius: 4px 4px 0 0",
        "font-size: 14px",
        "font-style: oblique",
    ].join(";")

}

const consoleLogStyled = (style, message)=>{
    console.log('%c%s', style, message);
}

export const consoleInfo = (message)=>{
    consoleLogStyled(style.info, message)
}
export const consoleError = (message)=> {
    consoleLogStyled(style.error, message);
}
export const consoleSucess = (message)=>{
    consoleLogStyled(style.success, message);
}
export const consoleDebug = (message)=>{
    consoleLogStyled(style.debug, message);
}