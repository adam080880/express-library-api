const con = require('./db')

module.exports = {
  isExists: (data = {}, table = '') => {
    return new Promise((resolve, reject) => {
      Object.keys(data).forEach((val, index) => {
        con.query(`SELECT * FROM ${table} WHERE ${val} = '${data[val]}'`, (err, res) => {
          if (err || !res) reject(Error(err))
          if (res.length === 1) resolve(res[0])
          else if (res.length > 1) resolve(res)
          else resolve(null)
        })
      })
    })
  },
  isFilled: (data = {}) => {
    let state = true

    Object.keys(data).forEach((val) => {
      if (data[val] === '' || !data[val]) {
        state = false
      }
    })

    return state
  }
}
