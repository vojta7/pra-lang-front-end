import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import Editor from 'react-simple-code-editor';
import Console from './components/console/Console'
import {IToken, ICodeOutput, Wasm} from "./rust_types";
import {linesWithErrors, code_highlight} from "./common";
import Tabbed from "./components/tabbed";
import Examples, {fibonacciCode, fizzBuzzCode} from "./components/examples";
import Grammar from "./components/grammar";
import Resizable from "./components/resizable";

function App(props: {wasm:Wasm}) {
  const [code, setCode] = useState(fibonacciCode);
  const [codeOutput, setCodeOutput] = useState(props.wasm.run(code) as ICodeOutput);
  const [codeTokens, setCodeTokens] = useState(props.wasm.simple_lex_code(code) as IToken[]);
  const [linesToHighlight, setLinesToHighlight] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const updateCode = (newCode: string) => {
      try {
          const output = props.wasm.run(newCode) as ICodeOutput;
          setCodeOutput(output);
          setCodeTokens(props.wasm.simple_lex_code(newCode) as IToken[]);
          setLinesToHighlight(linesWithErrors(newCode, output));
          setCode(newCode);
      } catch (e) {
          console.error(`unexpected error ${e}`);
          alert("Unexpected error, reloading page.");
          window.location.reload()
      }
  };

  return (
    <div className="root">
        <header className="top-bar">
            <div className="header">
                <h1>Editor</h1>
            </div>
            <nav className="menu">
                <button className={selectedTab == 0 ? "selected" : ""} onClick={()=>setSelectedTab(0)}>Console</button>
                <button className={selectedTab == 1 ? "selected" : ""} onClick={()=>setSelectedTab(1)}>Grammar</button>
                <button className={selectedTab == 2 ? "selected" : ""} onClick={()=>setSelectedTab(2)}>About</button>
            </nav>
        </header>
        <div className="content">
            <Resizable>
                <div className="scrollable">
                    <Editor
                        value={code}
                        className="editor"
                        textareaId="codeArea"
                        onValueChange={updateCode}
                        highlight={code => code_highlight(code, codeTokens, linesToHighlight)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: '0.9em',
                        }}
                    />
                </div>
                <Tabbed className="max-height right-panel" selected={selectedTab}>
                    <Console
                        code={code}
                        output={codeOutput}
                    />
                    <Grammar/>
                    <div className="about">
                        <h2>About</h2>
                        <p>Simple toy language with source code and more detailed description available at github.</p>
                        <p>Lexer, parser and interpreter is written in rust and compiled to webassembly, but it can also be used from command line. Syntax highlighting is implemented in typescript and uses tokens provided by lexer.</p>
                        <a href="https://github.com/vojta7/pra-lang-front-end"><img src="./GitHub-Mark-64px.png" /></a>
                    </div>
                </Tabbed>
            </Resizable>
        </div>
        <Examples className="bottom-bar" setCode={updateCode}/>
    </div>
  );
}

function updateHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

async function run() {
    updateHeight();
    window.document.body.onresize = updateHeight;
    let wasm = await import("../pra_lang_interface/pkg/pra_lang_interface");
    console.log(wasm.run("fn main() { 2*3 -1 }"));
    console.log(wasm.parse_code("fn main() { 2*3 -1 }"));
    ReactDOM.render(<App wasm={wasm}/>, document.getElementById("root"));
}

run();

