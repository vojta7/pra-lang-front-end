import React from 'react';
import {ICodeOutput} from '../../rust_types'
import ParsingError from './ParsingError'
import RuntimeError from "./RuntimeError";

export default function Console(props: {className?: string,code: string, output: ICodeOutput}) {
    let className="console";
    if (props.className) {
        className += ` ${props.className}`
    }
    return (
        <div className={className}>
            <CodeOutput code={props.code} output={props.output}/>
        </div>
    )
}

function CodeOutput(props: {code: string, output: ICodeOutput}) {
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

