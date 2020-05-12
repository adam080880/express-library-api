const { isExists, isFilled } = require('../utils/validator')
const transactionMember = require('../models/transaction_member')
const response = require('../utils/response')

module.exports = {
  booking: async (req, res) => {
    const { book_id: bookId, promise_returned_at: promiseReturnedAt } = req.body
    const userId = 2

    if (!isFilled({ bookId, promiseReturnedAt })) return res.status(400).send(response(false, req.body, 'Book id and return date must be filled'))

    const isBookExists = await isExists({ id: bookId }, 'books')
    if (!isBookExists) return res.status(400).send(response(false, req.body, 'Book id must be valid data'))
    if (parseInt(isBookExists.book_status_id) === 2) return res.status(400).send(response(false, req.body, 'Status book is not available'))

    const result = await transactionMember.createTransaction({ member_id: userId, book_id: bookId, promise_returned_at: promiseReturnedAt })
    if (result) return res.status(201).send(response(true, req.body, 'Transaction has been created'))
    else return res.status(500).send(response(false, req.body, 'Internal server error or unhandled error'))
  }
}
