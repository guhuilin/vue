// [[1, 2], 3, [[[4], 5]]]

const flatten = arr => {
    return [].concat(...arr.map((v, i) => (Array.isArray(v) ? flatten(v) : v)));
};

const res = flatten([[1, 2], 3, [[[4], 5]]]);

console.log(res);

// var arr1 = [1, 2, [3, 4]];
// arr1.flat();
// console.log(9**3)
let obj = {a:1,b:[2,3],c:'string'}
// console.log(obj.getOwnPropertyDescriptors())