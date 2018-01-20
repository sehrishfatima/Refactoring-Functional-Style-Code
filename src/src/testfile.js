var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

var filename = process.argv[2];
console.log('Processing', filename);
var ast = esprima.parse(fs.readFileSync('./map.js', { encoding: 'utf8'}));
var done = false;
var loopAST;

function createLoopTemplate(name){
    var looptemplate =  {
        "type": "ForStatement",
        "init": {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "i"
                    },
                    "init": {
                        "type": "Literal",
                        "value": 0,
                        "raw": "0"
                    }
                }
            ],
            "kind": "var"
        },
        "test": {
            "type": "BinaryExpression",
            "operator": "<",
            "left": {
                "type": "Identifier",
                "name": "i"
            },
            //    "right": "expression": {
            "right": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                    "type": "Identifier",
                    "name": name
                },
                "property": {
                    "type": "Identifier",
                    "name": "length"
                }
            }
        },
        "update": {
            "type": "UpdateExpression",
            "operator": "++",
            "argument": {
                "type": "Identifier",
                "name": "i"
            },
            "prefix": false
        },
        "body": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "init": null
                        }
                    ],
                    "kind": "var"
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "item"
                        },
                        "right": {
                            "type": "MemberExpression",
                            "computed": true,
                            "object": {
                                "type": "Identifier",
                                "name": "animals"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "count"
                            }
                        }
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "lengths"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "push"
                            }
                        },
                        "arguments": [
                            {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                    "type": "Identifier",
                                    "name": "item"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "length"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };

    return looptemplate;

}


estraverse.replace(ast, {
    enter: function(node){
        if(done)
            return this.break();
        if (node.type === 'MemberExpression'){
            //if(node.property.name=="map"){
            //console.log('Encountered assignment to', node.property.name);

            var callee = node.callee.object.name;

            var loopAST = createLoopTemplate(callee);
            done = true;
            /*node.type === 'ForStatement';
            node.init.type === 'AssignmentExpression';
            node.init.operator === '=';
            node.init.left.type === 'Identifier';
            node.init.left.name === 'count';

            node.init.right.type === 'Identifier';
            node.init.right.value === '0';
            node.init.right.value === '0';*/
            //}
        }
    },

    leave: function (node, parent) {
        // if (node.type == 'VariableDeclarator')

        if (done)
            console.log(node.callee.object.name);
        return this.break();
    }
});

escodegen.generate(loopAST);


/*
//var esprima = require('esprima');
  var estraverse = require('estraverse');
  var escodegen = require('escodegen');

  (function () {
    //build an ast with 2 lines of code
    var ast = esprima.parse("console.log('1');\n console.log('2');")
    console.log("original code:\n" + escodegen.generate(ast));
    console.log();

    //remove one of the lines, works!
    var done = false;
    ast = estraverse.replace(ast, {
      enter: function (node) {
        if (done)
          return this.break();
        if (node.type === esprima.Syntax.ExpressionStatement) {
          done = true;
          this.remove();
        }
      },
      leave: function (node) {
        if (done)
          return this.break();
      }
    });
    console.log("removed node:\n" + escodegen.generate(ast));
  })()*/