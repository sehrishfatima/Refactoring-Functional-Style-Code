var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

var filename = process.argv[2];
console.log('Processing', filename);
var ast = esprima.parse(fs.readFileSync('./foreach.js', { encoding: 'utf8'}));
estraverse.traverse(ast, {
    enter: function(node){
        if (node.type === 'CallExpression'){
            //console.log('Encountered assignment to', node.left.raw);

        }
    }
});

