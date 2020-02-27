use mylib::ast::{ArgList, VarVal};
use mylib::{execute, parse, Buildins, Lexer, ParsingError, Program, RuntimeError, Token};
use serde::Serialize;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct ProgramResult {
    parsing_error: Option<ParsingError>,
    runtime_error: Option<RuntimeError>,
    return_value: Option<String>,
    stdout: Option<String>,
}

#[derive(Serialize)]
struct ParsingResult {
    parsing_error: Option<ParsingError>,
    ast: Option<Program>,
}

fn buildins<'a>(output: &'a mut String) -> Buildins<'a> {
    let mut f: Buildins = HashMap::new();
    f.insert(
        "print".to_owned(),
        Box::from(move |args: ArgList| {
            for arg in args.args {
                match arg {
                    VarVal::I32(Some(v)) => output.push_str(&format!("{}", v)),
                    VarVal::BOOL(Some(v)) => output.push_str(&format!("{}", v)),
                    VarVal::STRING(Some(v)) => output.push_str(&format!("{}", v)),
                    VarVal::UNIT => output.push_str("()"),
                    _ => (),
                }
            }
            output.push_str("\n");
            VarVal::UNIT
        }),
    );
    f
}

#[wasm_bindgen]
pub fn run(input: &str) -> JsValue {
    let mut output = String::new();
    let mut buildins = buildins(&mut output);
    JsValue::from_serde(&match parse(input) {
        Ok(program) => {
            let program_result = execute(&program, &mut HashMap::new(), &mut buildins);
            std::mem::forget(buildins);
            match program_result {
                Ok(v) => ProgramResult {
                    parsing_error: None,
                    runtime_error: None,
                    return_value: Some(format!("{}", v)),
                    stdout: Some(output),
                },
                Err(e) => ProgramResult {
                    parsing_error: None,
                    runtime_error: Some(e),
                    return_value: None,
                    stdout: None,
                },
            }
        }
        Err(e) => ProgramResult {
            parsing_error: Some(e),
            runtime_error: None,
            return_value: None,
            stdout: None,
        },
    })
    .unwrap()
}

#[wasm_bindgen]
pub fn parse_code(input: &str) -> JsValue {
    JsValue::from_serde(&match parse(input) {
        Ok(program) => ParsingResult {
            parsing_error: None,
            ast: Some(program),
        },
        Err(e) => ParsingResult {
            parsing_error: Some(e),
            ast: None,
        },
    })
    .unwrap()
}

#[derive(Serialize)]
struct TokenOut {
    from: usize,
    to: usize,
    simple_type: String,
}

fn token_to_simple_type(token: &Token) -> &'static str {
    use Token::*;
    match token {
        LBrace | LParen | RBrace | RParen => "brace",
        True | False => "boolean-value",
        If | Else | Function => "keyword",
        Ident(_) => "ident",
        StringValue(_) => "string",
        DecLiteral(_) => "dec-literal",
        I32 | Boolean | String => "data-type",
        _ => "symbol",
    }
}

#[wasm_bindgen]
pub fn simple_lex_code(input: &str) -> JsValue {
    let lexer = Lexer::new(input);
    let tokens: Vec<_> = lexer.collect::<Result<_, _>>().unwrap();
    let tokens: Vec<_> = tokens
        .iter()
        .map(|(from, token, to)| TokenOut {
            from: *from,
            to: *to,
            simple_type: token_to_simple_type(token).to_owned(),
        })
        .collect();
    JsValue::from_serde(&tokens).unwrap()
}
