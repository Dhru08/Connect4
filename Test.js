let arr1 = [1, 2, 3];
let arr2 = arr1;

arr1[0] = 9;

console.log(arr1);  // Output: [99, 2, 3]
console.log(arr2);  // Output: [99, 2, 3]
