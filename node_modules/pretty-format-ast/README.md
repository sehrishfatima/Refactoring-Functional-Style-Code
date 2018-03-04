# pretty-format-ast

> [pretty-format2](https://github.com/pretty-format/pretty-format2) plugin to print ASTs prettier

### Installation

```sh
yarn add pretty-format pretty-format-ast
```

### Usage

```js
const prettyFormat2 = require('pretty-format2');
const prettyFormatAST = require('pretty-format-ast');

prettyFormat2(val, {
  plugins: [prettyFormatAST],
})
```

```js
Node "FunctionDeclaration"
  __clone: [Function __clone]
  async: false
  body: Node "BlockStatement" (1:29, 1:31)
    body: Array []
    directives: Array []
  expression: false
  generator: false
  id: Node "Identifier" (1:9, 1:10)
    name: "a"
  params: Array [
    Node "Identifier" (1:11, 1:18)
      name: "b"
      typeAnnotation: Node "TypeAnnotation" (1:12, 1:18)
        typeAnnotation: Node "StringLiteralTypeAnnotation" (1:14, 1:18)
          extra: Object {
            "raw": "\"hi\"",
            "rawValue": "hi",
          }
          value: "hi",
    Node "Identifier" (1:20, 1:21)
      name: "c",
    Node "RestElement" (1:23, 1:27)
      argument: Node "Identifier" (1:26, 1:27)
        name: "d",
  ]
```
