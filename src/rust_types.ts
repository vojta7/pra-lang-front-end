export type Wasm = typeof import("../pra_lang_interface/pkg/pra_lang_interface")

export interface IRuntimeError {
    description: string,
    position: number
}
export interface ICodeOutput {
    parsing_error?: IParsingError,
    runtime_error?: IRuntimeError,
    return_value?: string,
    stdout?: string
}

export interface IParsingError {
    from: number,
    to: number,
    description: string
}

export interface IToken {
    from: number,
    to: number,
    simple_type: string
}

