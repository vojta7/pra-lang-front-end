import React, {ReactNode, useState} from 'react';

export default function Grammar(props: {className?: string}) {
    let classNames="";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    return (
        <div className="grammar">
            <h2>NonTerminals</h2>
            <pre className={classNames}>{nonTerminals}</pre>
            <h2>Terminals</h2>
            <pre className={classNames}>{terminals}</pre>
        </div>
)
}

const nonTerminals = `\
Program             -> Function+
Function            -> 'fn' Identifier '(' ArgumentList ')' Block
ArgumentList        -> ( VariableDeclaration ',' )*  VariableDeclaration?
VariableDeclaration -> Identifier ':' DataType
DataType -> TI32 | TString | TBoolean | TUnit
Block -> '{' Statement* Expression '}'
Statement -> Expression ';'
    | Identifier '=' Expression;
Expression -> Identifier '(' ExpressionList ')'
    | Expression OrOp And
    | 'if' Expression Block
    | 'if' Expression Block 'else' Block
    | And
And -> And AndOp Comparison
    | Comparison
Comparision -> Comparison ComparisonOp Addition
    | Addition
Addition -> Addition AdditionOp Factor
    | Factor
Factor -> Factor FactorOp Term
    | Term
Term -> Number | Boolean | String | Identifier | "(" Expression ")"
`;

const terminals = `\
    AdditionOp -> '+' | '-'
    FactorOp -> '*' | '/' | '%'
    ComparisonOp -> '<' | '<=' | '==' | '>' | '>=' | '!='
    AndOp -> '&&'
    OrOp -> '||'
    I32 -> [0-9]+
    String -> '"' r"[^\"]" '"'
    Boolean -> 'true' | 'false'
    Identifier -> r"[a-zA-Z][a-zA-Z_]*"
    TI32 -> 'i32'
    TString -> 'String'
    TBoolean -> 'bool'
    TUnit -> '()'
`;
