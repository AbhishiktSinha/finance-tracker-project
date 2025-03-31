import { Button } from "antd";
import { downloadAsCsv } from "../../../../utils";
import { useContext } from "react";
import modalContext from "../../../../../../components_common/ModalWrapper/context";

import '../../styles/confirm-modal-styles.scss'

export default function ExportSelectedModal({transactionsList}) {

    const {closeModal} = useContext(modalContext)

    function onConfirm() {

        const download = downloadAsCsv(transactionsList);
        download();

        setTimeout(()=>{
            closeModal();
        }, 150)
    }

    return (
        <div className="export-selected-modal-content transaction-action-confirm-modal">
            <h2 className="title">Export Selected Transactions As CSV</h2>

            <div className="buttons-container">
                <Button 
                    type={'primary'}
                    onClick={onConfirm}                
                >
                    Export
                </Button>
            </div>
        </div>
    )
}