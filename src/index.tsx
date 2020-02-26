import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import Editor from 'react-simple-code-editor';

const exmaple_code = `// print fizz buzz for given number
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

function App(props: {wasm:any}) {
  const [code, setCode] = useState(exmaple_code);

  return (
    <Editor
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => (<SRSCode code={code} lex={props.wasm.simple_lex_code} />)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  );
}

interface Token {
    from: number,
    to: number,
    simple_type: string
}

function SRSCode(props: {code: string, lex: (arg1: string) => any}) {
    const tokens=props.lex(props.code) as Token[];
    let lastElement = 0;
    let highlightedCode: React.ReactNode[] = [];
    tokens.map(({from, to, simple_type})=>{
        if (from > lastElement) {
            highlightedCode.push((<span>{props.code.substring(lastElement,from)}</span>));
        }
        lastElement = to;
        highlightedCode.push((<span className={simple_type}>{props.code.substring(from,to)}</span>))
    })
    return (
        <div>{highlightedCode.map(el => el)}</div>
    )
}

async function run() {
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run()

