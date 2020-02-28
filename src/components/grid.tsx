import React, {ReactNode} from 'react';

type GridSize = null | 1 | 2 | 3 | 4 | 5 | 6
export default function Grid(props: {children: ReactNode, item?: boolean, container?: boolean, size?: GridSize, className?: string}) {
    let classNames=""
    if (props.item) classNames += " grid-item"
    if (props.container) classNames += " grid-container"
    const size = props.size ? props.size : 6
    classNames += ` grid-size${size}`
    if (props.className) {
        classNames += ` ${props.className}`
    }
    return (<div className={classNames}>{props.children}</div>)
}
