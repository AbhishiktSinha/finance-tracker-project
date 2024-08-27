import { Skeleton } from "antd";

/**
 * Custom implementation wrapper of the Ant-d skeleton for dashboard page 
 * card component details
 */
export default function CardDetailsSkeleton(props) {
    const {className, ...restProps} = props;

    return (
        <Skeleton
            rootClassName={`card-details-skeleton ${className?className:''}`}
            paragraph={false}
            title={true}
            active={true}
            {...restProps}
        />
    )
}