import { useSelector } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { Button, Skeleton, Tooltip } from "antd";
import { MoonOutlined } from "@ant-design/icons";

import './styles.scss'
import { selectDefaultCurrency } from "../../../../features/PrivateLayout/redux/selectors";

export default function QuickActionsIsland() {


    const defaultCurrency = useSelector(selectDefaultCurrency);
    const symbol = defaultCurrency?.symbol;
    const code = defaultCurrency?.code;

    // const defaultCurrency = undefined;

    return (
        <div className="quick-actions-island">

            {
                defaultCurrency ?
                    (
                        <Tooltip
                            title={code}
                        >
                            <Button
                                rootClassName="quick-action-button"
                                shape="circle"
                                size="default"
                            >
                                {symbol}
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