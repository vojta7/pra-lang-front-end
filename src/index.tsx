import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import Editor from 'react-simple-code-editor';
import Console from './components/console/Console'
import Grid from './components/grid'
import {IToken, ICodeOutput, Wasm} from "./rust_types";
import {linesWithErrors, code_highlight} from "./common";

// TODO move to separate file
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

function App(props: {wasm:Wasm}) {
  const [code, setCode] = useState(example_code);
  const [codeOutput, setCodeOutput] = useState(props.wasm.run(code) as ICodeOutput);
  const [codeTokens, setCodeTokens] = useState(props.wasm.simple_lex_code(code) as IToken[]);
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);

  const updateCode = (code: string) => {
      setCode(code);
      const output = props.wasm.run(code) as ICodeOutput;
      setCodeOutput(output);
      setCodeTokens(props.wasm.simple_lex_code(code) as IToken[]);
      setLinesToHighlight(linesWithErrors(code, output))
  };

  return (
    <div>
        <Grid container className="full-view">
            <Grid item size={3} className="scrollable">
                <Editor
                    value={code}
                    className="editor"
                    textareaId="codeArea"
                    onValueChange={updateCode}
                    highlight={code => code_highlight(code, codeTokens, linesToHighlight)}
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

async function run() {
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

