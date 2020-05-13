const con = require('../utils/db')
const table = 'users'
const table2 = 'user_details'

module.exports = {
  create: (data) => {
    const sql = `INSERT INTO ${table} SET ?`
    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        if (res.affectedRows > 0) resolve(true)
        else resolve(false)
      })
    })
  },
  complete_biodata: (data) => {
    const sql = `INSERT INTO ${table2} SET ?`
    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        if (res.affectedRows > 0) resolve(true)
        resolve(false)
      })
    })
  }
}
