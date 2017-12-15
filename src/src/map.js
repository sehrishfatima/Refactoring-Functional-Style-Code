var animals = ["cat","dog","fish"];
function getLength(word) {
    return word.length;
}
console.log(animals.map(getLength)); //[3, 3, 4]