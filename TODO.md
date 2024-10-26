# Gray Overflows 

<div class='light-on'>
<style>
    .light-on{
        position: relative;
        background-color: #000;
        padding: 24px;

        display: flex;        
        gap: 18px;
        flex-wrap: wrap;
        min-width: fit-content;

        >span {
            padding: 4px 8px;
            border-radius: 8px;
            background-color: #fff;
            color: #000;
            font-weight: 600;
            box-shadow: 0 0 15px 2px #f7e55e;
            white-space: nowrap;
        }
    }
</style>
<span>Savings in _month_</span>
</div>

## Currency Conversion QuickAction 
Add a QuickAction Button opens a currency conversion modal.  
Leverage the day's conversion rates stored in `localStorage`.  

Button stays loading as long as the exchange-rate API calling process is ongoing.  


## Week Starts On [customisation setting]
Allow the user to select the starting day of the week: `Sunday` or `Monday`.  
By default `Monday` following the ISO Week definition


## Custom Tag Checks
Check before adding a custom tag, if a tag with a similar name doesn't already exist.  
Computation uncessarily heavy for client side, need a backend.  

## Extra Fields in Transactions & File uploads
Learn file uplaods using Firebase Storage  
Add code to accomodate extra fields in a transaction document:  
<pre>
{ 
    reciept: __url__, 
    paymentMode: // only for expenditure transactions
    description
}
</pre>