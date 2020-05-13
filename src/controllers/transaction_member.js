const { isExists, isFilled } = require('../utils/validator')
const transactionMember = require('../models/transaction_member')
const response = require('../utils/response')

module.exports = {
  booking: async (req, res) => {
    const { book_id: bookId, promise_returned_at: promiseReturnedAt } = req.body
    const userId = req.me.id

    const data = { ...req.body, ...{ member_id: userId } }

    if (!isFilled({ bookId, promiseReturnedAt })) return res.status(400).send(response(false, data, 'Book id and return date must be filled'))

    const isBookExists = await isExists({ id: bookId }, 'books')
    if (!isBookExists) return res.status(400).send(response(false, data, 'Book id must be valid data'))
    if (parseInt(isBookExists.book_status_id) === 2) return res.status(400).send(response(false, data, 'Status book is not available'))

    const result = await transactionMember.createTransaction({ member_id: userId, book_id: bookId, promise_returned_at: promiseReturnedAt })
    if (result) return res.status(201).send(response(true, data, 'Transaction successfully created'))
    else return res.status(500).send(response(false, data, 'Internal server error or unhandled error'))
  }
}
