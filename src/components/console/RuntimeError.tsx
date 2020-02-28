import {linePosition} from "../../common";
import React from "react";
import {IRuntimeError} from "../../rust_types";

export default function RuntimeError(props: {code: string,error: IRuntimeError, className?: string}) {
    let [line, position] = linePosition(props.code, props.error.position);
    let myClassName="errors";
    if (props.className) {
        myClassName += ` ${props.className}`
    }
    return (<div className={myClassName}>Error line {line} pos {position}:<br/>>{props.error.description}</div>)
}
