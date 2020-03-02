import React, {ReactNode, useState} from 'react';

export default function Grammar(props: {className?: string}) {
    let classNames="";
    if (props.className) {
        classNames += ` ${props.className}`
    }
    return (
        <div className="grammar">
            <dl>
                <dt>Name+</dt>
                <dd>One or more repetitions of name</dd>
                <dt>Name*</dt>
                <dd>Zero or more repetitions of name</dd>
                <dt>Name?</dt>
                <dd>One or Zero repetition of name</dd>
                <dt>'string'</dt>
                <dd>String literal</dd>
            </dl>
            <h3>NonTerminals</h3>
            <pre className={classNames}>{nonTerminals}</pre>
            <h3>Terminals</h3>
            <pre className={classNames}>{terminals}</pre>
        </div>
)
}

const nonTerminals = `\
Program
    -> Function+
Function
    -> 'fn' Identifier '(' ArgumentList ')' Block
ArgumentList
    -> ( VariableDeclaration ',' )*  VariableDeclaration?
VariableDeclaration
    -> Identifier ':' DataType
DataType
    -> TI32
    | TString
    | TBoolean
    | TUnit
Block
    -> '{' Statement* Expression '}'
Statement
    -> Expression ';'
    | Identifier '=' Expression;
Expression
    -> Identifier '(' ExpressionList ')'
    | Expression OrOp And
    | If
If
    -> 'if' Expression Block
    | 'if' Expression Block 'else' Block
    | 'if' Expression Block 'else' If
And
    -> And AndOp Comparison
    | Comparison
Comparision
    -> Comparison ComparisonOp Addition
    | Addition
Addition
    -> Addition AdditionOp Factor
    | Factor
Factor ->
    Factor FactorOp Term
    | Term
Term
    -> Number
    | Boolean
    | String
    | Identifier
    | '(' Expression ')'
`;

const terminals = `\
AdditionOp  -> '+' | '-'
FactorOp    -> '*' | '/' | '%'
ComparisonOp-> '<' | '<=' | '==' | '>' | '>=' | '!='
AndOp       -> '&&'
OrOp        -> '||'
I32         -> [0-9]+
String      -> '"' r"[^\"]" '"'
Boolean     -> 'true' | 'false'
Identifier  -> r"[a-zA-Z][a-zA-Z_]*"
TI32        -> 'i32'
TString     -> 'String'
TBoolean    -> 'bool'
TUnit       -> '()'
`;
