import { useContext, useState } from "react";
import FilterConditionsContext from "../../context/FilterConditionsContext";
import TransactionsInitializerContext from "../../context/TransactionsInitializerContext";
import { debounce } from "../../../../utils";
import { filterTransactions } from "../../utils";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterAltRounded, FilterListRounded } from "@mui/icons-material";



export default function TransactionsTable({query}) {    

    const { appliedFilters } = useContext(FilterConditionsContext)
    const { transactionsInitializer, getCustomTimeframe } = useContext(TransactionsInitializerContext);

    const [selectedTransactions, setSelectedTransactions] = useState(new Set([]));;

    const filteredTransactionsList = filterTransactions(transactionsInitializer.data, appliedFilters, query);

    console.log(filteredTransactionsList);
}