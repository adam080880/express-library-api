const con = require('../utils/db')
const table = 'users'
const table2 = 'user_details'

module.exports = {
  count: (data) => {
    const fixDataId = data[1] === 'id' ? 'users.id' : data[1]
    const query = `SELECT COUNT(*) as total FROM ${table}, ${table2}, roles WHERE (name LIKE ? OR email LIKE ?) AND ${table}.id=${table2}.user_id AND ${table}.role_id=roles.id ORDER BY ${fixDataId} ${data[2]}`
    return new Promise((resolve, reject) => {
      const search = ('%' + data[0] + '%')
      con.query(query,
        [search, search],
        (err, res) => {
          if (err) reject(Error(err))
          resolve(res[0].total)
        })
    })
  },
  get: (start, end, data = []) => {
    const sql = `SELECT users.id, users.email, user_details.name, user_details.birthdate, user_details.phone, user_details.gender, roles.role as role FROM ${table}, ${table2}, roles WHERE (name LIKE ? OR email LIKE ?) AND ${table}.id=${table2}.user_id AND ${table}.role_id=roles.id ORDER BY ${data[1]} ${data[2]} LIMIT ${end} OFFSET ${start}`
    return new Promise((resolve, reject) => {
      const search = ('%' + data[0] + '%')
      con.query(sql, [search, search], (err, res) => {
        if (err) reject(Error(err))
        resolve(res)
      })
    })
  },
  getMember: (start, end, data = []) => {
    const sql = `SELECT users.id, users.email, user_details.name, user_details.birthdate, user_details.phone, user_details.gender, roles.role as role FROM ${table}, ${table2}, roles WHERE ${table}.role_id=2 AND (name LIKE ? OR email LIKE ?) AND ${table}.id=${table2}.user_id AND ${table}.role_id=roles.id ORDER BY ${data[1]} ${data[2]} LIMIT ${end} OFFSET ${start}`
    return new Promise((resolve, reject) => {
      const search = ('%' + data[0] + '%')
      con.query(sql, [search, search], (err, res) => {
        if (err) reject(Error(err))
        resolve(res)
      })
    })
  },
  changeRole: (data) => {
    const sql = `UPDATE ${table} SET ? WHERE ?`
    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        if (res.affectedRows > 0) resolve(true)
        else resolve(false)
      })
    })
  },
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
