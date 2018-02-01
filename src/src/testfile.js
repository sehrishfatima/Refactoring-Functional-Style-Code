var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
const util = require('util')
var filename = process.argv[2];
console.log('Processing', filename);
var done = false;
var loopAST;

/*function createLoopTemplate(name){
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

}*/

function forEachReturn(arrayName) {
    console.log(arrayName);
 return   {
        "type"
    :
        "ForStatement",
            "init"
    :
        {
            "type"
        :
            "VariableDeclaration",
                "declarations"
        :
            [
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
                "kind"
        :
            "var"
        }
    ,
        "test"
    :
        {
            "type"
        :
            "BinaryExpression",
                "operator"
        :
            "<",
                "left"
        :
            {
                "type"
            :
                "Identifier",
                    "name"
            :
                "i"
            }
        ,
            "right"
        :
            {
                "type"
            :
                "MemberExpression",
                    "computed"
            :
                false,
                    "object"
            :
                {
                    "type"
                :
                    "Identifier",
                        "name"
                :
                    arrayName
                }
            ,
                "property"
            :
                {
                    "type"
                :
                    "Identifier",
                        "name"
                :
                    "length"
                }
            }
        }
    ,
        "update"
    :
        {
            "type"
        :
            "UpdateExpression",
                "operator"
        :
            "++",
                "argument"
        :
            {
                "type"
            :
                "Identifier",
                    "name"
            :
                "i"
            }
        ,
            "prefix"
        :
            false
        }
    ,
        "body"
    :
        {
            "type"
        :
            "BlockStatement",
                "body"
        :
            [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "console"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "log"
                            }
                        },
                        "arguments": [
                            {
                                "type": "MemberExpression",
                                "computed": true,
                                "object": {
                                    "type": "Identifier",
                                    "name": arrayName
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "i"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};

function generate_the_ast(recievedCode){
    var ast = esprima.parse(recievedCode);
    estraverse.replace(ast,{
        enter: function (node) {
            if (node.type == 'ExpressionStatement' &&
                    node.expression.callee.property.name == "forEach")
            {
                var arrayName = node.expression.callee.object.name;
                //var body = node.expression.arguments;

                return forEachReturn(arrayName);

            }
        },
        leave: function (node, parent) {

        }
    });

    console.log(escodegen.generate(ast));

}
function read_it(filename,cb){


    //...
    cb(code)
}

function main(){
    var code = fs.readFileSync('./foreach.js', { encoding: 'utf8'});
    generate_the_ast(code);
}
main();
