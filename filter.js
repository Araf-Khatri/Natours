/* eslint-disable */

const arr = [[1, [2]], 3, [[4, 5, [[6]], 7, 8, 9], 10]];

Array.prototype.filtering = function (callback) {
  const ansArr = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      ansArr.push(this[i]);
    }
  }
  return ansArr;
};


Array.prototype.flatArr = function (toFlat) {
  const ansArr = []

  for (let i = 0; i < this.length; i++) {
    if (Number.isInteger(this[i]) || toFlat === 0) {
      ansArr.push(this[i])
    }
    else {
      ansArr.push(...this[i].flatArr(toFlat - 1))
      
    }
  }
  return ansArr
}

const ansArr = arr.flatArr(1);

console.log(ansArr)
