import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import Editor from 'react-simple-code-editor';
import {Console} from './components/console'
import {Grid} from './components/grid'

const example_code = `// print fizz buzz for given number
fn print_fizzbuzz(n: i32) {
    mod3 = n % 3 == 0;
    mod5 = n % 5 == 0;
    if mod3 && mod5 {
        print("Fizz Buzz")
    } else {
        if mod3 {
            print("Fizz")
        } else {
            if mod5 {
                print("Buzz")
            } else {
                print(n)
            }
        }
    }
}

// print fizz buzz from current to stop
fn fizzbuzz(current: i32, stop: i32) {
    if current <= stop {
        print_fizzbuzz(current);
        fizzbuzz(current+1, stop)
    }
}

fn main() {
    fizzbuzz(1, 100)
}
`;

type Wasm = typeof import("../pra_lang_interface/pkg/pra_lang_interface")

function linesWithErrors(code: string, output: CodeOutput): number[] {
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

function App(props: {wasm:Wasm}) {
  const [code, setCode] = useState(example_code);
  const [codeOutput, setCodeOutput] = useState(props.wasm.run(code) as CodeOutput);
  const [codeTokens, setCodeTokens] = useState(props.wasm.simple_lex_code(code) as Token[]);
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);

  const updateCode = (code: string) => {
      setCode(code);
      const output = props.wasm.run(code) as CodeOutput;
      setCodeOutput(output);
      setCodeTokens(props.wasm.simple_lex_code(code) as Token[]);
      setLinesToHighlight(linesWithErrors(code, output))
  };

  return (
    <div>
        <Grid container className="full-view">
            <Grid item size={3}>
                <Editor
                    value={code}
                    className="editor"
                    textareaId="codeArea"
                    onValueChange={updateCode}
                    highlight={code => SRSCode(code, codeTokens, linesToHighlight)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
                />
            </Grid>
            <Grid item size={3}>
                <Console
                    code={code}
                    output={codeOutput}
                />
            </Grid>
        </Grid>
    </div>
  );
}

export interface RuntimeError {
    description: string,
    position: number
}
export interface CodeOutput {
    parsing_error?: ParsingError,
    runtime_error?: RuntimeError,
    return_value?: string,
    stdout?: string
}

export interface ParsingError {
    from: number,
    to: number,
    description: string
}

export function linePosition(input: string, pos: number): [number,number] {
    let slice = input.substr(0,pos);
    let lines = slice.split("\n");
    return [lines.length,lines[lines.length -1].length]
}

interface Token {
    from: number,
    to: number,
    simple_type: string
}

function SRSCode(code: string, tokens: Token[], linesToHighlight: number[]): string {
    let lastElement = 0;
    let highlightedCode = "";
    tokens.map(({from, to, simple_type})=>{
        if (from > lastElement) {
            highlightedCode += `<span>${code.substring(lastElement,from)}</span>`;
        }
        lastElement = to;
        highlightedCode += `<span class=${simple_type}>${code.substring(from,to)}</span>`
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

async function run() {
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

