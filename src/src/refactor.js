module.exports = main;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
const escomplex = require('escomplex');
var sloc = require('sloc');
const util = require('util');
var now = require("performance-now");
var out;

var filename = process.argv[2];
var fileOutput;

console.log('Processing', filename);
//var done = false;
var loopAST;

//Returns the array name and replaced parameter in AST
function refactorReturn(arrayName,body, replacedParameterName) {
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

function assignBodyVariable(statement){
    return esprima.parse(statement).body[0];
}
//generate and replace the AST with the body of for loop
function generate_the_ast(recievedCode,filename){
    var ast = esprima.parse(recievedCode);
    estraverse.replace(ast,{
        enter: function (node) {

            switch(node.type == 'ExpressionStatement' && node.expression.type == 'CallExpression' &&
            node.expression.callee.property.name == "forEach")

            if (node.type == 'ExpressionStatement' && node.expression.type == 'CallExpression' &&
                node.expression.callee.property.name == "forEach")
            {
                var arrayName = node.expression.callee.object.name;
                var body = node.expression.arguments[0].body.body;

                var functionArgument = node.expression.arguments[0].params[0].name;
                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));

                return refactorReturn(arrayName, body, functionArgument);

            }
            else if (node.type == 'ExpressionStatement' &&  node.expression.type == 'CallExpression' &&
                node.expression.callee.property.name == "map")
            {
                var arrayName = node.expression.callee.object.name;
                var body = node.expression.arguments[0].body.body;

                var functionArgument = node.expression.arguments[0].params[0].name;
                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));

                return refactorReturn(arrayName, body, functionArgument);

            }
            else if (node.type == 'ExpressionStatement' &&  node.expression.type == 'CallExpression' &&
                node.expression.callee.property.name == "reduce")
            {
                var arrayName = node.expression.callee.object.name;
                var body = node.expression.arguments[0].body.body;

                var functionArgument = node.expression.arguments[0].params[0].name;
                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));

                return refactorReturn(arrayName, body, functionArgument);

            }
            else (node.type == 'ExpressionStatement' && node.expression.type == 'CallExpression' &&
                node.expression.callee.property.name == "filter")
            {
                var arrayName = node.expression.callee.object.name;
                var body = node.expression.arguments[0].body.body;

                var functionArgument = node.expression.arguments[0].params[0].name;
                body.splice(0,0,assignBodyVariable("var "+functionArgument+"=arr[i];"));

                return refactorReturn(arrayName, body, functionArgument);

            }
        },
        leave: function (node, parent) {

        }
    });

    var out = escodegen.generate(ast);
    //writes refactored code to the output file
    fs.writeFileSync('../../out/'+filename, out);


    //write to file


}

function main(){

    fs.readdirSync("../../in").forEach(filename=>{
        var code = fs.readFileSync('../../in/'+filename,{encoding: 'utf8'});
    var t0 = now();

    generate_the_ast(code,filename);
    var t1 = now();

    var previousFile = fs.readFileSync('../../in/'+filename, 'utf8');
    var newFile = fs.readFileSync('../../out/'+filename, 'utf8');

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

    var functionsBefore = findComplexity(previousFile);
    var functionsAfter = findComplexity(newFile);

    console.log("The values before Refactoring: ",functionsBefore);
    console.log("The values after Refactoring: ",functionsAfter);
    console.log("Call to generate Tree took " + (t1 - t0) + " milliseconds.")


});
}
main();

//Result = escomplex.analyse(fs.readFileSync(pathToFileToAnalyse)) //For cyclomatic complexity
