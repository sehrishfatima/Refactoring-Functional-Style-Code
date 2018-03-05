/*

var animals = ["cat","dog","fish"];
var total = animals.reduce(function(sum, word) {
    console.log(sum + word.length);
}, 0);
console.log(total);
*/

var arr = [1, 2, 3];
var result=arr.reduce(function (total, num) {
    result = total+num;
    console.log(result);
}, 0);

/*const euros = [29.76, 41.85, 46.5];
const sum = euros.reduce((total, amount) => total + amount);
console.log(sum);
//sum // 118.11


const euros = [29.76, 41.85, 46.5];
var sum=0;
for(i=0;i<euros.length;i++){
    sum=sum+euros[i];
}
console.log(sum);

*/
