const transactionModel = require('../models/transaction')

const { isFilled } = require('../utils/validator')
const response = require('../utils/response')

const pagination = require('../utils/pagination')

module.exports = {
  get: async (req, res) => {
    const data = await pagination(req.query, transactionModel, 'transactions', 'transaction')
    return res.status(200).send(response(data.success, data.data.map((val, index) => {
      const date = new Date(val.promise_returned_at)
      return { ...val, promise_returned_at: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` }
    }), data.msg, { pageInfo: data.pageInfo }))
  },
  toBorrow: async (req, res) => {
    const { id } = req.params
    const userId = req.me.id

    const data = { ...{ id }, ...{ admin_id: userId } }

    if (!isFilled({ id })) return res.status(400).send(response(false, data, 'transaction id must be filled'))

    const check = await transactionModel.getOne({ id })
    if (!check) return res.status(400).send(response(false, data, 'Transaction id must be valid data'))
    if (!(check.returned_at === null || check.returned_at === 'null' || check.returned_at === 'NULL')) return res.status(400).send(response(false, data, 'Returned is already filled'))
    if (check.transaction_status_id === 3 || check.transaction_status_id === 2) return res.status(400).send(response(false, data, 'Status is not valid'))

    const validDate = (new Date().getTime() - new Date(check.promise_returned_at).getTime()) / (1000 * 24 * 3600)
    if (Math.floor(validDate) >= 0) {
      return res.status(400).send(response(false, data, 'Promise return date is not valid'))
    }

    const result = await transactionModel.toBorrow([{ admin_id: userId }, { id }])
    if (result) return res.status(200).send(response(true, data, 'Data has been updated to status borrowed'))
    else return res.status(500).send(response(false, data, 'Internal server error or unhandled error'))
  },
  toReturned: async (req, res) => {
    const { id } = req.params

    const data = { id }

    if (!isFilled({ id })) return res.status(400).send(response(false, data, 'transaction id must be filled'))

    const result = await transactionModel.getOne({ id })
    let fine = 0
    if (result) {
      if (result.returnedAt === null || result.returnedAt === 'null' || result.returnedAt === 'NULL') return res.status(400).send(response(false, data, 'Returned is already filled'))
      if (result.transaction_status_id === 1 || result.transaction_status_id === 3) return res.status(400).send(response(false, data, 'Status is not valid'))

      const promiseReturnedAt = result.promise_returned_at
      const promiseDate = new Date(promiseReturnedAt)
      const returnedAt = new Date()
      if (promiseDate.getTime() < returnedAt.getTime()) {
        const late = (returnedAt.getTime() - promiseDate.getTime()) / (1000 * 24 * 3600)
        fine = process.env.LATE_FINE * Math.floor(late)
      }
      const toReturn = await transactionModel.toReturn([{ fine, returned_at: `${parseInt(returnedAt.getFullYear())}-${parseInt(returnedAt.getMonth()) + 1}-${parseInt(returnedAt.getDate())}` }, { id }], { id: result.book_id })
      if (toReturn) {
        return res.status(200).send(response(true, data, 'Status has been updated to returned'))
      } else {
        return res.status(500).send(response(false, data, 'Internal server error or unhandled error'))
      }
    } else {
      return res.status(400).send(response(false, data, 'Transaction id must be valid data'))
    }
  }
}
