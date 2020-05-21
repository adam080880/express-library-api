const test = (param_ = []) => {
  const result = []
  let tempArr = new Array()

  for (let a = 0; a < param_.length - 1; a++) {
    if (param_[a] < param_[a+1]) tempArr.push(param_[a])
    if (a === param_.length - 2 && param_[a] > param_[a - 1]) tempArr.push(param_[a + 1])
    
    if (param_[a] > param_[a+1]) {
      tempArr = new Array(...tempArr)
      result.push(tempArr)
      tempArr = new Array
    }
  }

  return result
}

console.log(test([3, 7, 15, 5, 9, 11]))
