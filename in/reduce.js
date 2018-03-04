/*
var animals = ["cat","dog","fish"];
var total = animals.reduce(function(sum, word) {
    return sum + word.length;
}, 0);
console.log(total);*/

var arr = [1, 2, 3];
var result=arr.reduce(function (total, num) {
    return total + num * 2;
    console.log(total + num * 2);
}, 0);
