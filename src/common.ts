import {ICodeOutput, IToken} from "./rust_types";

export function linePosition(input: string, pos: number): [number,number] {
    let slice = input.substr(0,pos);
    let lines = slice.split("\n");
    return [lines.length,lines[lines.length -1].length]
}

export function linesWithErrors(code: string, output: ICodeOutput): number[] {
    if (output.parsing_error) {
        let [line, ] = linePosition(code,output.parsing_error.from);
        return [line]
    } else if (output.runtime_error) {
        let [line, ] = linePosition(code,output.runtime_error.position);
        return [line]
    } else {
        return []
    }
}

export function code_highlight(code: string, tokens: IToken[], linesToHighlight: number[]): string {
    let lastElement = 0;
    let highlightedCode = "";
    const escape = (code: string) => code
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    tokens.map(({from, to, simple_type})=>{
        if (from > lastElement) {
            highlightedCode += `<span>${escape(code.substring(lastElement,from))}</span>`;
        }
        lastElement = to;
        highlightedCode += `<span class=${simple_type}>${escape(code.substring(from,to))}</span>`
    });
    return highlightedCode
        .split("\n")
        .map((line, i) => {
            if (linesToHighlight.find((v) => v - 1 === i)) {
                return `<span class='editorLineNumber error'>${i + 1}</span>${line}`
            } else {
                return `<span class='editorLineNumber'>${i + 1}</span>${line}`
            }
        })
        .join("\n")
}

