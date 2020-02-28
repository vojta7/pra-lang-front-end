import {linePosition} from "../../common";
import React from "react";
import {IParsingError} from "../../rust_types";

export default function ParsingError(props: {code: string,error: IParsingError, className?: string}) {
    let [line, position] = linePosition(props.code, props.error.from);
    let myClassName="errors";
    if (props.className) {
        myClassName += ` ${props.className}`
    }
    return (<div className={myClassName}>Error line {line} pos {position}:<br/>>{props.error.description}</div>)
}

