import { memo, useMemo, useRef } from "react";
import defaults from "../defaults";
import CardPopover from "./CardPopover";
import { useSelector } from "react-redux";
import { DayJSUtils } from "../../../../../dayjs";
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, MoreOutlined, ShareAltOutlined } from "@ant-design/icons";
import { selectTag_wrapper } from "../../../redux/selectors";
import TransactionSum from "./TransactionSum";
import ConvertedSum from "./ConvertedSum";
import { Button } from "antd";

function CardDetailsUI ({ transactionObj, openModal }) {


        const { id, data: { amount, currency, type, timestamp: { occurredAt }, title, tagId } } = transactionObj;

        const { data: { color: tagColor, name: tagName } } = useSelector(selectTag_wrapper(tagId));


        const transaction_date = DayJSUtils.format(occurredAt, 'YYYY-MM-DD');


        /* ----------------- popover stuff -------------- */
        const cardRef = useRef(null);
        const triggerElementRef = useRef(null);
        const popoverMenu = useMemo(() => {

            return (
                [
                    {
                        title: defaults.cardPopoverActions.EDIT,
                        icon: <EditOutlined />,
                        onClick: () => { 
                            console.log('--- EDIT ---', title) 
                            openModal(defaults.cardPopoverActions.EDIT)
                        }
                    },
                    {
                        title: defaults.cardPopoverActions.DELETE,
                        icon: <DeleteOutlined />,
                        onClick: () => {
                             console.log('---- DELETE ----', title) 
                             openModal(defaults.cardPopoverActions.DELETE)
                            },
                    },
                    {
                        title: defaults.cardPopoverActions.SHARE,
                        icon: <ShareAltOutlined />,
                        onClick: () => {
                             console.log('------ SHARE -----', title)
                             openModal(defaults.cardPopoverActions.SHARE)
                            }
                    }
                ]
            )

        }, [])
        

        return (
            <div className="transaction-card-hor" ref={cardRef}>

                <div className="transaction-card-hor-row transaction-amount-row">

                    <TransactionSum
                        type={type}
                        amount={amount}
                        currency_code={currency}
                    />

                    {/* <div className="divider divider-dotted">
                    <img src={TwoArrowsImage} alt="amount_conversion" />
                </div> */}

                    <ConvertedSum
                        type={type}
                        amount={amount}
                        currency_code={currency}
                    />

                </div>

                <div className="transaction-card-hor-row transaction-title-row">
                    {title}
                </div>

                <div className="transaction-card-hor-row">
                    <span className="transaction-date">{transaction_date}</span>

                    <span
                        className="transaction-tag-chip"
                        style={{ backgroundColor: tagColor }}
                    >
                        {tagName}
                    </span>
                </div>

                <div
                    className="transaction-card-hor-accent"
                    style={{ borderColor: tagColor }}>

                </div>

                <CardPopover 
                    cardElementRef={cardRef}
                    triggerElementRef={triggerElementRef}
                    cardEvent={'contextmenu'}
                    triggerEvent={'click'}
                    popoverMenu={popoverMenu}
                    zIndex={800}
                >

                    <Button
                        ref={triggerElementRef}
                        rootClassName='transaction-card-more-button'
                        shape='circle'
                        type='text'>

                        <MoreOutlined
                            style={{ fontSize: '18px', fontWeight: '800' }}
                        />
                    </Button>                

                </CardPopover>
            </div>
        )
    }


export default memo(CardDetailsUI)