const con = require('../utils/db')

const table = 'genres'

module.exports = {
  get: () => {
    const sql = `SELECT * FROM ${table}`

    return new Promise((resolve, reject) => {
      con.query(sql, (err, res) => {
        if (err) reject(Error(err))
        resolve(res)
      })
    })
  },
  count: () => {
    const sql = `SELECT COUNT(*) as total FROM ${table}`

    return new Promise((resolve, reject) => {
      con.query(sql, (err, res) => {
        if (err) reject(Error(err))
        resolve(res[0].total)
      })
    })
  },
  find: (id) => {
    const sql = `SELECT * FROM ${table} WHERE ?`

    return new Promise((resolve, reject) => {
      con.query(sql, { id }, (err, res) => {
        if (err) reject(Error(err))
        resolve(res)
      })
    })
  },
  create: (data) => {
    const sql = `INSERT INTO ${table} SET ?`

    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        resolve(res.affectedRows)
      })
    })
  },
  update: (data) => {
    const sql = `UPDATE ${table} SET ? WHERE ?`

    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        resolve(res.affectedRows)
      })
    })
  },
  delete: (data) => {
    const sql = `DELETE FROM ${table} WHERE ?`

    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        resolve(res.affectedRows)
      })
    })
  }
}
