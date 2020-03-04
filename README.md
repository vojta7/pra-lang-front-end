# Web demo of a toy language

Simple web editor with examples for my toy [language](https://github.com/vojta7/pra-lang)

## Building

Language parser and interpreter are written in Rust, so you will need a [Rust intallation](https://www.rust-lang.org/) in order to compile it and uses [wasm-pack](https://github.com/rustwasm/wasm-pack) for javascript bindings. The simplest way to install wasm-pack is with ``cargo install wasm-pack``. The web page is written in typescript and react, so you will need npm to compile it.

```
npm install
npm run build
```

Resulting web page is placed in dist/ folder. You can optionally start local webserver with ``npm run start:dev``

