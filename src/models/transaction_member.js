const con = require('../utils/db')

const table = 'transactions'

module.exports = {
  createTransaction: (data) => {
    const { book_id: bookId } = data
    const sql = `INSERT INTO ${table} SET ?`
    const sql2 = 'UPDATE books SET ? WHERE ?'

    const data2 = [{ book_status_id: 2 }, { id: bookId }]

    return new Promise((resolve, reject) => {
      con.beginTransaction(() => {
        con.query(sql, { ...data, ...{ transaction_status_id: 1 } }, (err, res) => {
          if (err) {
            con.rollback((rollbackErr) => {
              if (rollbackErr) reject(Error(rollbackErr).message)
              reject(Error(err).message)
            })
          }
        })
        con.query(sql2, data2, (err, res) => {
          if (err) {
            con.rollback((rollbackErr) => {
              if (rollbackErr) reject(Error(rollbackErr).message)
              reject(Error(err).message)
              throw err
            })
          }
          con.commit((commitErr) => {
            if (commitErr) reject(Error(commitErr).message)
            if (res.affectedRows > 0) resolve(true)
            else resolve(false)
          })
        })
      })
    })
  }
}
