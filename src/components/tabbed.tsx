import React, {ReactNode, useState} from 'react';

export default function Tabbed(props: {children: ReactNode[], className?: string, selected: number}) {
    let classNames="";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    if (props.selected >= props.children.length) {
        console.error("selected tab is out of bounds")
    }
    return (
        <div className={classNames}>
            <div className="tab">{props.children[props.selected]}</div>
        </div>
    )
}
