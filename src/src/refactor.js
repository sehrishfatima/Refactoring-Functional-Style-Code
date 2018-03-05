module.exports = main;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
const escomplex = require('escomplex');
var sloc = require('sloc');
const util = require('util');
var now = require("performance-now");
var print = require('pretty-print');
var child_process = require('child_process');
var out;

var filename = process.argv[2];
var fileOutput;

var loopAST;

//Returns the array name and replaced parameter in AST
function refactorForeach(arrayName,body, replacedParameterName) {
    console.log(arrayName);
    console.log(replacedParameterName);
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
                body
            }
    }
};



function refactorMap(arrayName,body, replacedParameterName,mappedArray) {
    console.log(arrayName);
    console.log(replacedParameterName);
    console.log(mappedArray);
    return {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": mappedArray
                },
                "init": {
                    "type": "ArrayExpression",
                    "elements": []
                }
            }
        ],
        "kind": "var"
    },
        {
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
                "right": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": arrayName
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
                "body": body
            }
        }

}


function refactorReduce(arrayName,body, replacedParameterName,accumulatingVariable) {
    console.log(arrayName);
    console.log(replacedParameterName);
    return   [{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": accumulatingVariable
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
        {
            "type": "ForStatement",
            "init": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "Identifier",
                    "name": "i"
                },
                "right": {
                    "type": "Literal",
                    "value": 0,
                    "raw": "0"
                }
            },
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "i"
                },
                "right": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": arrayName
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
                "body": body
                    }

            }
]

};
function refactorFilter(arrayName,body, replacedParameterName,filteredOutput) {
    console.log(arrayName);
    console.log(replacedParameterName);
    return   [{
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": filteredOutput
                },
                "init": {
                    "type": "ArrayExpression",
                    "elements": []
                }
            }
        ],
        "kind": "var"
    },
        {
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
                "right": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": arrayName
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
                "body": body
            }
        }]
};





function assignBodyVariable(statement){
    return esprima.parse(statement).body[0];
}

//replace the AST with the body of for loop
function generate_the_ast(receivedCode,filename){
    var ast = esprima.parse(receivedCode);
    estraverse.replace(ast,{
        enter: function (node) {
            if (node.type == 'ExpressionStatement' && node.expression.type == 'CallExpression' &&
                node.expression.callee.property.name == "forEach")

            {
                var arrayName = node.expression.callee.object.name;
                var body = node.expression.arguments[0].body.body;

                var functionArgument = node.expression.arguments[0].params[0].name;

                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));

                return refactorForeach(arrayName, body, functionArgument);

            }
             else if (node.type == 'VariableDeclaration' &&  node.declarations[0].type == 'VariableDeclarator' && node.declarations[0].init.type == 'CallExpression' &&
                node.declarations[0].init.callee.property.name == "map")
            {

                var arrayName = node.declarations[0].init.callee.object.name;
                var body = node.declarations[0].init.arguments[0].body.body;


                var functionArgument = node.declarations[0].init.arguments[0].params[1].name;
                var mappedArray = node.declarations[0].id.name;

                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));
                return refactorMap(arrayName, body, functionArgument,mappedArray);

            }
             else if (node.type == 'VariableDeclaration' &&  node.declarations[0].type == 'VariableDeclarator' && node.declarations[0].init.type == 'CallExpression' &&
                node.declarations[0].init.callee.property.name == "reduce")
            {
                var arrayName = node.declarations[0].init.callee.object.name;
                var body = node.declarations[0].init.arguments[0].body.body;
                var accumulatingVariable= node.declarations[0].id.name;

                var functionArgument1 = node.declarations[0].init.arguments[0].params[1].name;

                body.splice(0,0,assignBodyVariable("var "+functionArgument1+"=arr[i];"));


                return refactorReduce(arrayName, body, functionArgument1,accumulatingVariable);

            }
             else if (node.type == 'VariableDeclaration' &&  node.declarations[0].type == 'VariableDeclarator' && node.declarations[0].init.type == 'CallExpression' &&
                node.declarations[0].init.callee.property.name == "filter")
            {

                var arrayName = node.declarations[0].init.callee.object.name;
                var body = node.declarations[0].init.arguments[0].body.body;

                var filteredOutput= node.declarations[0].id.name;
                var functionArgument = node.declarations[0].init.arguments[0].params[0].name;
                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=array[i];"));

                return refactorFilter(arrayName, body, functionArgument,filteredOutput);

            }

        },
        leave: function (node, parent) {

        }
    });

    var out = escodegen.generate(ast);
    //writes refactored code to the output file
    fs.writeFileSync('../../out/'+filename, out);


}

function findComplexity(file) {
    var funcObj = {};
    var result = new Object();
    funcObj = escomplex.analyse(file);
    slocValue = funcObj.aggregate.sloc.logical;
    cycloValue = funcObj.aggregate.cyclomatic;
    result[0] = slocValue;
    result[1] = cycloValue;
    return result;

}

function main(){

    fs.readdirSync("../../in").forEach(filename=>{
        var originalBegin = now();
        child_process.execSync("node ../../in/"+filename);
        var originalEnd = now();
        var code = fs.readFileSync('../../in/'+filename,{encoding: 'utf8'});
        //var t0 = now();

        generate_the_ast(code,filename);
        //var t1 = now();

        var previousFile = fs.readFileSync('../../in/'+filename, 'utf8');
        var newFile = fs.readFileSync('../../out/'+filename, 'utf8');

        var refactoredBegin = now();
        child_process.execSync("node ../../out/"+filename);
        var refactoredEnd = now();
        var functionsBefore = findComplexity(previousFile);
        var functionsAfter = findComplexity(newFile);

        console.log("The difference made today for " +filename +"is",(refactoredEnd-refactoredBegin)-(originalEnd-originalBegin));

        console.log("The values before Refactoring: ",functionsBefore);
        console.log("The values after Refactoring: ",functionsAfter);
        //console.log("Call to generate Tree took " + (t1 - t0) + " milliseconds.")


});
}
main();

//Result = escomplex.analyse(fs.readFileSync(pathToFileToAnalyse)) //For cyclomatic complexity
