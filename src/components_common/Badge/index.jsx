
import './styles.scss'

/**## Badge Component
 * **Note**: Requires consuming component to have `position: relative` style rule
 * 
 * @param {object} param0 
 * @param {string} param0.size 'default' | 'small' 
 * @param {number} param0.count
 * @param {boolean} param0.showDot true | false --> show dot instead of a number, if true: ignores any count if provided
 * @param {boolean} param0.showZero true | false --> show 0 count as a badge, default false: does not render badge on count 0
 */
export default function Badge({size, offset, count, showDot, showZero, ...restProps}) {

    const {rootClassName, className, ...safeProps} = restProps;
    const additionalClassName = (rootClassName || className) ? (
        rootClassName ? " " + rootClassName : "" ) : (
            className ? " " + className: "");

    return (
        <div className={"common-badge" + additionalClassName} 
            type={showDot ? 'dot': 'badge'}
            style={{
                ...(offset && {top: offset[1], right: offset[0]}), 
                ...(size && (size == 'small' && {width: '15px', minWidth: '15px', aspectRatio: '1'}))
            }}
            {...safeProps}
        >
            {
                !showDot && ( count != 0 || (count == 0 && showZero) ) && (
                    <span className="badge-count">{count}</span>
                )
            }
        </div>
    )
}