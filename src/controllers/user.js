const response = require('../utils/response')
const { isExists, isFilled } = require('../utils/validator')
const pagination = require('../utils/pagination')
const paginationMember = require('../utils/pagination_member')
const userModel = require('../models/user')

module.exports = {
  get: async (req, res) => {
    const data = await pagination(req.query, userModel, 'users', 'user')
    data.data = data.data.map((val, index) => {
      return { ...val, ...{ gender: (val.gender === 'm') ? 'Male' : 'Female' } }
    })

    return res.status(200).send(response(data.success, data.data, data.msg, { pageInfo: data.pageInfo }))
  },
  getAllMember: async (req, res) => {
    const data = await paginationMember(req.query, userModel, 'users', 'user')
    data.data = data.data.map((val, index) => {
      return { ...val, ...{ gender: (val.gender === 'm') ? 'Male' : 'Female' } }
    })

    return res.status(200).send(response(data.success, data.data, data.msg, { pageInfo: data.pageInfo }))
  },
  findMember: async (req, res) => {
    const { id } = req.params

    if (!isFilled({ id })) return res.status(400).send(response(false, req.params, 'User id is must be filled'))

    const userExists = await isExists({ id }, 'users')
    if (!userExists) return res.status(404).send(response(false, req.params, 'User id is not valid'))

    const transactions = await isExists({ member_id: `${id}' AND books.id=transactions.book_id AND ''='` }, 'transactions, books')
    return res.status(200).send(response(true, {
      ...{ ...userExists, password: null },
      ...{
        histories: transactions.map((val, index) => {
          const date = new Date(val.promise_returned_at)
          return { ...val, promise_returned_at: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` }
        })
      }
    }))
  },
  find: async (req, res) => {
    delete req.me.password
    return res.status(200).send(response(true, req.me, 'Profile'))
  },
  toggleRole: async (req, res) => {
    const { id } = req.params
    const data = { id }

    if (!isFilled({ id })) return res.status(400).send(response(false, data, 'User id is required'))

    const userExist = await isExists({ id }, 'users')
    if (!userExist) return res.status(400).send(response(false, data, 'User id must be valid data'))

    const roleId = parseInt(userExist.role_id) === 1 ? 2 : 1

    if (userModel.changeRole([{ role_id: roleId }, { id }])) {
      return res.status(200).send(response(true, data, `User role successfully changed to ${(roleId === 1 ? 'Admin' : 'Member')}`))
    } else {
      return res.status(500).send(response(false, data, 'Internal server error or unhandled error'))
    }
  }
}
