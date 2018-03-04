// @flow
'use strict';

const {series} = require('pretty-format2');

/*::
import type {Plugin} from 'pretty-format2';

type Position = {
  line: number,
  column: number,
};

type Location = {
  start: Position,
  end: Position,
};

type Node = {
  type: string,
  loc: Location,
  [key: string]: mixed,
} | {
  kind: string,
  loc: Location,
  [key: string]: mixed,
};

type Path = {
  type: string,
  node: Node,
  [key: string]: mixed,
};
*/

function isNumber(val) {
  return typeof val === 'number';
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isNodeLike(obj) {
  return typeof obj.type === 'string' || typeof obj.kind === 'string';
}

function isPathLike(obj) {
  return isNodeLike(obj) && obj.hasOwnProperty('node');
}

function getTypeKey(obj) {
  if (typeof obj.type === 'string') return 'type';
  if (typeof obj.kind === 'string') return 'kind';
}

function printPosition(position /*: Position */, stack) {
  let hasLine = isNumber(position.line);
  let hasColumn = isNumber(position.column);

  if (hasColumn) stack.char('' + position.column);
  if (hasLine && hasColumn) stack.char(':');
  if (hasLine) stack.char('' + position.line);
}

function printLocation(location /*: Location */, stack, env) {
  let hasStart = isObject(location.start);
  let hasEnd = isObject(location.end);

  stack.char(')');
  stack.char(env.colors.comment.close);
  if (hasEnd) printPosition(location.end, stack);
  if (hasStart && hasEnd) stack.char(', ');
  if (hasStart) printPosition(location.start, stack);
  stack.char('(');
  stack.char(env.colors.comment.open);
}

let DROP_KEYS = {
  kind: false,
  type: false,
  start: true,
  end: true,
  loc: true,
};

function printNodeMember(value, index, length, context, stack, env) {
  let val = context[value];
  stack.push(val);
  stack.char(': ');
  stack.char(value);
}

function printNode(node /*: Node */, stack, env, refs) {
  let typeKey = getTypeKey(node);
  let keys = Object.keys(node)
    .filter(key => !DROP_KEYS[key] && key !== typeKey)
    .sort();

  if (keys.length) {
    stack.up();

    series(node, keys, stack, env, printNodeMember);

    stack.newLine();
    stack.down();
  }

  if (node.loc) {
    printLocation(node.loc, stack, env);
    stack.char(' ');
  }

  let typeValue = typeKey && node[typeKey];
  if (typeof typeValue === 'string') {
    stack.char(env.colors.tag.close);
    stack.char('"' + typeValue + '"');
    stack.char(env.colors.tag.open);
  }
}

let printAST /*: Plugin */ = {
  test(value) {
    if (value === null) return false;
    if (typeof value !== 'object') return false;
    if (!isNodeLike(value)) return false;
    return true;
  },

  printOptimized(value /*: Path | Node */, stack, env, refs) {
    let isPath = isPathLike(value);

    if (isPath) {
      /*:: value = ((value: any): Path) */
      value = value.node;
    }

    /*:: value = ((value: any): Node) */

    printNode(value, stack, env, refs);

    if (!env.opts.min) {
      if (isPath) {
        stack.char('Path ');
      } else {
        stack.char('Node ');
      }
    }
  }
};

module.exports = printAST;
