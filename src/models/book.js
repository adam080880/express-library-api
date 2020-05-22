const con = require('../utils/db')

const table = 'books'
const relationalTable = 'authors, genres, book_statuses'

module.exports = {
  count: (data) => {
    const query = `SELECT COUNT(*) as total FROM ${table} WHERE title LIKE ? ORDER BY ${data[1]} ${data[2]}`
    return new Promise((resolve, reject) => {
      con.query(query,
        [('%' + data[0] + '%')],
        (err, res) => {
          if (err) reject(Error(err))
          resolve(res[0].total)
        })
    })
  },
  get: (start, end, data = []) => {
    const sql = `SELECT * FROM ${table} WHERE title LIKE ? ORDER BY ${data[1]} ${data[2]} LIMIT ${end} OFFSET ${start}`
    return new Promise((resolve, reject) => {
      con.query(sql, [('%' + data[0] + '%')], (err, res) => {
        if (err) reject(Error(err))
        resolve(res)
      })
    })
  },
  getOne: async (data) => {
    const { id } = data
    const sql = `SELECT books.id, books.title, books.description, books.image, genres.name as genre, authors.name as author, book_statuses.name AS status FROM ${table + ', ' + relationalTable} WHERE books.book_status_id=book_statuses.id AND books.author_id=authors.id AND books.genre_id=genres.id AND books.?`
    const sql2 = 'SELECT transactions.id, (SELECT email FROM users WHERE transactions.member_id=users.id) AS member, (SELECT email FROM users WHERE transactions.admin_id=users.id) AS admin, transactions.updated_at AS last_updated from transactions WHERE ?'
    let result = {}

    return new Promise((resolve, reject) => {
      con.query(sql, { id }, (err, res1) => {
        if (err) reject(Error(err))
        con.query(sql2, { book_id: id }, (err, res2) => {
          if (err) reject(Error(err))
          result = { data: res1[0], histories: res2 }
          resolve(result)
        })
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
  update: (data) => {
    const sql = `UPDATE ${table} SET ? WHERE ?`

    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        if (res.affectedRows >= 0) resolve(true)
        else resolve(false)
      })
    })
  },
  delete: (data) => {
    const sql = `DELETE FROM ${table} WHERE ?`

    return new Promise((resolve, reject) => {
      con.query(sql, data, (err, res) => {
        if (err) reject(Error(err))
        if (res.affectedRows > 0) resolve(true)
        else resolve(false)
      })
    })
  }
}
