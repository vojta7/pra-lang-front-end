import React, {ReactNode} from 'react';
import {CodeOutput, ParsingError, RuntimeError, linePosition} from '../index'

export function Console(props: {className?: string,code: string, output: CodeOutput}) {
    let className="console"
    if (props.className) {
        className += ` ${props.className}`
    }
    return (
        <div className={className}>
            <CodeOutput code={props.code} output={props.output}/>
        </div>
    )
}

function CodeOutput(props: {code: string, output: CodeOutput}) {
    const myClassName="code-output";
    if (props.output.stdout !== null) {
        return (<pre className={myClassName}>{props.output.stdout}</pre>)
    } else if (props.output.parsing_error != null) {
        return (<ParsingError className={myClassName} code={props.code} error={props.output.parsing_error}/>)
    } else if (props.output.runtime_error != null) {
        return (<RuntimeError className={myClassName} code={props.code} error={props.output.runtime_error}/>)
    } else {
        return (<pre className={myClassName} />)
    }
}

function ParsingError(props: {code: string,error: ParsingError, className?: string}) {
    let [line, position] = linePosition(props.code, props.error.from);
    let myClassName="errors";
    if (props.className) {
        myClassName += ` ${props.className}`
    }
    return (<div className={myClassName}>Error line {line} pos {position}:<br/>>{props.error.description}</div>)
}

function RuntimeError(props: {code: string,error: RuntimeError, className?: string}) {
    let [line, position] = linePosition(props.code, props.error.position);
    let myClassName="errors";
    if (props.className) {
        myClassName += ` ${props.className}`
    }
    return (<div className={myClassName}>Error line {line} pos {position}:<br/>>{props.error.description}</div>)
}

