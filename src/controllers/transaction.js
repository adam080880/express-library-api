const transactionModel = require('../models/transaction')

const { isFilled } = require('../utils/validator')
const response = require('../utils/response')

const pagination = require('../utils/pagination')

module.exports = {
  get: async (req, res) => {
    const data = await pagination(req.query, transactionModel, 'transactions', 'transaction')
    return res.status(200).send(data)
  },
  toBorrow: async (req, res) => {
    const { id } = req.params
    const userId = req.me.id

    if (!isFilled({ id })) return res.status(400).send(response(false, req.params, 'transaction id must be filled'))

    const check = await transactionModel.getOne({ id })
    if (!check) return res.status(400).send(response(false, req.params, 'Transaction id must be valid data'))
    if (check.returnedAt === null || check.returnedAt === 'null' || check.returnedAt === 'NULL') return res.status(400).send(response(false, req.params, 'Returned is already filled'))

    const result = await transactionModel.toBorrow([{ id: userId }, { id }])
    if (result) return res.status(200).send(response(true, req.params, 'Data has been updated to status borrowed'))
    else return res.status(500).send(response(false, req.params, 'Internal server error or unhandled error'))
  },
  toReturned: async (req, res) => {
    const { id } = req.params

    if (!isFilled({ id })) return res.status(400).send(response(false, req.params, 'transaction id must be filled'))

    const result = await transactionModel.getOne({ id })
    let fine = 0
    if (result) {
      if (result.returnedAt === null || result.returnedAt === 'null' || result.returnedAt === 'NULL') return res.status(400).send(response(false, req.params, 'Returned is already filled'))

      const promiseReturnedAt = result.promise_returned_at
      const promiseDate = new Date(promiseReturnedAt)
      const returnedAt = new Date()
      if (promiseDate.getTime() < returnedAt.getTime()) {
        const late = (returnedAt.getTime() - promiseDate.getTime()) / (1000 * 24 * 3600)
        fine = process.env.LATE_FINE * Math.floor(late)
      }
      const toReturn = await transactionModel.toReturn([{ id, fine, returned_at: `${parseInt(returnedAt.getFullYear())}-${parseInt(returnedAt.getMonth()) + 1}-${parseInt(returnedAt.getDate())}` }, { id }], { id: result.book_id })
      if (toReturn) {
        return res.status(200).send(response(true, req.params, 'Status has been updated to returned'))
      } else {
        return res.status(500).send(response(false, req.params, 'Internal server error or unhandled error'))
      }
    } else {
      return res.status(400).send(response(false, req.params, 'Transaction id must be valid data'))
    }
  }
}
