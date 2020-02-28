import React from 'react';
import ReactDOM from 'react-dom';
import {useState, useEffect} from 'react';
import Editor from 'react-simple-code-editor';
import Console from './components/console/Console'
import Grid from './components/grid'
import {IToken, ICodeOutput, Wasm} from "./rust_types";
import {linesWithErrors, code_highlight} from "./common";
import Tabbed from "./components/tabbed";
import Examples, {fizzBuzzCode} from "./components/examples";
import Grammar from "./components/grammar";
import Resizable from "./components/resizable";

function App(props: {wasm:Wasm}) {
  const [code, setCode] = useState(fizzBuzzCode);
  const [codeOutput, setCodeOutput] = useState(props.wasm.run(code) as ICodeOutput);
  const [codeTokens, setCodeTokens] = useState(props.wasm.simple_lex_code(code) as IToken[]);
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const updateCode = (code: string) => {
      setCode(code);
      const output = props.wasm.run(code) as ICodeOutput;
      setCodeOutput(output);
      setCodeTokens(props.wasm.simple_lex_code(code) as IToken[]);
      setLinesToHighlight(linesWithErrors(code, output))
  };

  return (
    <Grid className="root">
        <Grid container className="menu">
            <Grid item size={3} className="centered">
                <h1>Editor</h1>
            </Grid>
            <Grid item size={3} container>
                <Grid item size={2}>
                    <button className={selectedTab == 0 ? "selected" : ""} onClick={()=>setSelectedTab(0)}>Console</button>
                </Grid>
                <Grid item size={2}>
                    <button className={selectedTab == 1 ? "selected" : ""} onClick={()=>setSelectedTab(1)}>Grammar</button>
                </Grid>
                <Grid item size={2}>
                    <button className={selectedTab == 2 ? "selected" : ""} onClick={()=>setSelectedTab(2)}>About</button>
                </Grid>
            </Grid>
        </Grid>
        <Grid container className="content">
            <Resizable>
                <Editor
                    value={code}
                    className="editor scrollable"
                    textareaId="codeArea"
                    onValueChange={updateCode}
                    highlight={code => code_highlight(code, codeTokens, linesToHighlight)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
                />
                <Tabbed className="max-height right-panel" selected={selectedTab}>
                    <Console
                        code={code}
                        output={codeOutput}
                    />
                    <Grammar/>
                    <h1>About</h1>
                </Tabbed>
            </Resizable>
        </Grid>
        <Examples className="bottom-bar" setCode={updateCode}/>
    </Grid>
  );
}

async function run() {
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

