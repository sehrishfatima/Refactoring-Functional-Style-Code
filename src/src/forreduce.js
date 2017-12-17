var animals = ["cat","dog","fish"];
var total = 0;
var item;
//for loop
for (var count = 0, loops = animals.length; count < loops; count++){
    item = animals[count];
    total += item.length;
}
//for loop ends
console.log(total); //10