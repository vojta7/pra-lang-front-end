use mylib::{execute, parse, ParsingError, Program, RuntimeError};
use serde::Serialize;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[derive(Serialize)]
struct ProgramResult {
    parsing_error: Option<ParsingError>,
    runtime_error: Option<RuntimeError>,
    return_value: Option<String>,
}

#[derive(Serialize)]
struct ParsingResult {
    parsing_error: Option<ParsingError>,
    ast: Option<Program>,
}

#[wasm_bindgen]
pub fn run(input: &str) -> JsValue {
    JsValue::from_serde(&match parse(input) {
        Ok(program) => match execute(&program, &mut HashMap::new()) {
            Ok(v) => ProgramResult {
                parsing_error: None,
                runtime_error: None,
                return_value: Some(format!("{}", v)),
            },
            Err(e) => ProgramResult {
                parsing_error: None,
                runtime_error: Some(e),
                return_value: None,
            },
        },
        Err(e) => ProgramResult {
            parsing_error: Some(e),
            runtime_error: None,
            return_value: None,
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
