import { useSelector } from "react-redux";
import { selectDefaultCurrency } from "./selectors";
import getSymbolFromCurrency from "currency-symbol-map";
import { Button, Skeleton, Tooltip } from "antd";
import { MoonOutlined } from "@ant-design/icons";

import './styles.css'

export default function QuickActionsIsland() {


    const defaultCurrency = useSelector(selectDefaultCurrency);

    const defaultCurrencyCode = getSymbolFromCurrency(defaultCurrency);
    // const defaultCurrency = undefined;

    return (
        <div className="quick-actions-island">

            {
                defaultCurrency ?
                    (
                        <Tooltip
                            title={defaultCurrency}
                        >
                            <Button
                                rootClassName="quick-action-button"
                                shape="circle"
                                size="default"
                            >
                                {defaultCurrencyCode}
                            </Button>
                        </Tooltip>
                    ) : 
                    (
                        <Skeleton 
                            paragraph={false}
                            title={true}
                            round={true}
                            active={true}
                            rootClassName="quick-action-button-skeleton"
                            
                        />
                    )
            }

            <Button 
                rootClassName="quick-action-button"
                shape='circle'
                icon={<MoonOutlined/>}
                size="default"
            />


        </div>
    )
}