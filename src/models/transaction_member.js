const con = require("../utils/db");

const table = "transactions";

module.exports = {
  get: (start, end, data) => {
    const sql = `SELECT t.id, t.promise_returned_at, books.title as book_title,
                 (SELECT users.email FROM users WHERE users.id=t.admin_id) as admin,
                 transaction_statuses.name as status, t.updated_at as last_updated FROM ${table} t,
                 books, transaction_statuses WHERE transaction_statuses.id=t.transaction_status_id
                 AND books.id=t.book_id AND t.member_id='${data[3].id}' AND (books.title LIKE ? OR (SELECT users.email FROM users WHERE users.id=t.admin_id) LIKE ? 
                 OR transaction_statuses.name LIKE ?) ORDER BY transaction_status_id, ${data[1]} ${data[2]} LIMIT ${end} OFFSET ${start}`;
    return new Promise((resolve, reject) => {
      const search = "%" + data[0] + "%";
      con.query(sql, [search, search, search], (err, res) => {
        if (err) reject(Error(err));
        if (res.length > 0) resolve(res);
        else resolve(res);
      });
    });
  },
  count: (data) => {
    return new Promise((resolve, reject) => {
      const query = "%" + data[0] + "%";
      con.query(
        `SELECT COUNT(*) as total FROM ${table} t,
                books, transaction_statuses WHERE transaction_statuses.id=t.transaction_status_id
                AND books.id=t.book_id AND t.member_id='${data[3].id}' AND (books.title LIKE ? OR (SELECT users.email FROM users WHERE users.id=t.admin_id) LIKE ? OR (SELECT users.email FROM users WHERE users.id=t.member_id) LIKE ?
                OR transaction_statuses.name LIKE ?)`,
        [query, query, query, query],
        (err, res) => {
          if (err) reject(Error(err));
          resolve(res[0].total);
        }
      );
    });
  },
  createTransaction: (data) => {
    const { book_id: bookId } = data;
    const sql = `INSERT INTO ${table} SET ?`;
    const sql2 = "UPDATE books SET ? WHERE ?";

    const data2 = [{ book_status_id: 2 }, { id: bookId }];

    return new Promise((resolve, reject) => {
      con.beginTransaction(() => {
        con.query(
          sql,
          { ...data, ...{ transaction_status_id: 1 } },
          (err, res) => {
            if (err) {
              con.rollback((rollbackErr) => {
                if (rollbackErr) reject(Error(rollbackErr).message);
                reject(Error(err).message);
              });
            }
          }
        );
        con.query(sql2, data2, (err, res) => {
          if (err) {
            con.rollback((rollbackErr) => {
              if (rollbackErr) reject(Error(rollbackErr).message);
              reject(Error(err).message);
              throw err;
            });
          }
          con.commit((commitErr) => {
            if (commitErr) reject(Error(commitErr).message);
            if (res.affectedRows > 0) resolve(true);
            else resolve(false);
          });
        });
      });
    });
  },
};
