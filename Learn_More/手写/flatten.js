// [[1, 2], 3, [[[4], 5]]]

const flatten = arr => {
    return [].concat(...arr.map((v, i) => (Array.isArray(v) ? flatten(v) : v)));
};

const res = flatten([[1, 2], 3, [[[4], 5]]]);
console.log(...[[1, 2], 3, [[[4], 5]]]);
console.log(res);

const escapeChart = str => {
    if(str.search('[') !== -1) str.replace('%5B','[')
    if(str.search(']') !== -1) str.replace('%5D',']')
    
    return str
}
console.log(escapeChart("[12,3,45,'44']"),'str')

// var arr1 = [1, 2, [3, 4]];
// arr1.flat();
// console.log(9**3)
// let obj = {a:1,b:[2,3],c:'string'}
// console.log(obj.getOwnPropertyDescriptors())