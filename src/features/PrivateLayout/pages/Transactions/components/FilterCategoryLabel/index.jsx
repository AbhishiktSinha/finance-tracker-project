import { Badge } from "antd";


export default function FilterCategoryLabel({label, selectedCount, overflowCount, isSingleSelect}) {

    if (isSingleSelect) {
        
        if (selectedCount > 0) {
            return (
                <Badge 
                    rootClassName="label-badge" 
                    dot
                    offset={[5, 5]}
                >
                    {label}
                </Badge>
            )
        }
    }
    else {
        return (
            <Badge
                count={selectedCount}
                overflowCount={overflowCount || 99}
                rootClassName="label-badge"
                offset={[10, 50]}
                size="small"
            >
                {label}
            </Badge>
        )
    }
}