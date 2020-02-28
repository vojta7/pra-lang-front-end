import React, {ReactElement, useState} from "react";

export default function Resizable(props: {children: [ReactElement, ReactElement]}) {
    const [position,setPosition] = useState<number|null>(null);
    const panelWidth = 14;
    const leftPanelStyle = {
        width: position ? `${position - panelWidth / 2}px` : `calc(50% - ${panelWidth / 2}px)`
    };
    const rightPanelStyle = {
        width: position ? `calc(100% - ${position}px - ${panelWidth / 2}px)` : `calc(50% - ${panelWidth / 2}px)`
    };
    const barStyle = {
        width: `${panelWidth}px`,
        backgroundColor: "#bbc5aa",
        cursor: "ew-resize",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
    };
    const innerBar = {
        height: "20px",
        border: "solid 1px #777879",
        margin: 0,
        padding: 0,
        "box-sizing": "border-box"
    };

    const resize = (e: MouseEvent) => {
        setPosition(e.pageX)
    };

    const stopResize = () => {
        window.removeEventListener('mousemove', resize)
    };

    return (
        <div className="resizable">
            <div style={leftPanelStyle}>
                {props.children[0]}
            </div>
            <div style={barStyle}
                 onMouseDown={
                     (e) => {
                         e.preventDefault()
                         window.addEventListener('mousemove', resize)
                         window.addEventListener('mouseup', stopResize)
                     }
                 } className="resizer">
                <div style={innerBar}/>
            </div>
            <div style={rightPanelStyle}>
                {props.children[1]}
            </div>
        </div>
    )
}

