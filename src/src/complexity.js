(function () {
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escomplex = require("escomplex");
var escodegen = require('escodegen');
var sloc = require('sloc');

/*
var previousFile = fs.readFileSync('../../in/'+filename, 'utf8');
var newFile = fs.readFileSync('../../out/'+fileOutput, 'utf8');

var functionsBefore = findComplexity(previousFile);
var functionsAfter = findComplexity(newFile);
var slocBefore = sloc(previousFile, "js");
var slocAfter = sloc(newFile, "js");
*/

function findComplexity(file) {
    var funcObj = {};
    var ast = esprima.parse(file.toString(), { loc: true });
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type === "FunctionDeclaration" && node.id && node.id.name) {
                var complexSloc = escomplex.analyse(escodegen.generate(node));
                funcObj[node.id.name] = {
                    'complexity': complexSloc.aggregate.cyclomatic,
                    'lines': complexSloc.aggregate.sloc.logical
                };
            }
        }
    });
    console.log(funcObj);
}
})();