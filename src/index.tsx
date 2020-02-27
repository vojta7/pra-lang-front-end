import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import Editor from 'react-simple-code-editor';

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

function App(props: {wasm:Wasm}) {
  const [code, setCode] = useState(example_code);

  return (
    <div>
        <Editor
          value={code}
          className="editor"
          textareaId="codeArea"
          onValueChange={code => setCode(code)}
          highlight={code => SRSCode(code, props.wasm.simple_lex_code)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
        <CodeOutput
            code={code}
            run={props.wasm.run}
        />
        <ParseOutput
            code={code}
            parse={props.wasm.parse_code}
        />
    </div>
  );
}

function CodeOutput(props: {code: string, run: (arg1: string) => any}) {
    const output = props.run(props.code);
    console.log(output);
    if (output.code !== null) {
        return (<pre className="console">{output.stdout}</pre>)
    } else {
        return (<pre className="console"></pre>)
    }
}

interface ParsingError {
    from: number,
    to: number,
    description: string
}
interface ParseOutput {
    parsing_error?: ParsingError,
    ast?: {}
}

function linePosition(input: string, pos: number): [number,number] {
    let slice = input.substr(0,pos)
    let lines = slice.split("\n")
    return [lines.length,lines[lines.length -1].length]
}

function ParseOutput(props: {code: string, parse: (arg1: string) => any}) {
    const output = props.parse(props.code) as ParseOutput;
    console.log(output?.ast);
    if (output.parsing_error !== null) {
        let [line, position] = linePosition(props.code, output.parsing_error ? output.parsing_error.from : 0)
        return (<div className="errors">Error line {line} pos {position}:<br/>>{output.parsing_error?.description}</div>)
    } else {
        return (<div className="errors"></div>)
    }
}

interface Token {
    from: number,
    to: number,
    simple_type: string
}

function SRSCode(code: string, lex: (arg1: string) => any): string {
    const tokens=lex(code) as Token[];
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
        .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
        .join("\n")
}

async function run() {
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

