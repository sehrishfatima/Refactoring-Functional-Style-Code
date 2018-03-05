/*
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

words.filter(word => word.length > 6);

//console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
*/

var array = [24,18,7,6];
var mappedArray = array.filter(function(age){
    age++
    return age >=18;
});