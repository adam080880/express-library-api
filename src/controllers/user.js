const response = require('../utils/response')
const { isExists, isFilled } = require('../utils/validator')
const pagination = require('../utils/pagination')
const userModel = require('../models/user')

module.exports = {
  get: async (req, res) => {
    const data = await pagination(req.query, userModel, 'users', 'user')
    data.data = data.data.map((val, index) => {
      return { ...val, ...{ gender: (val.gender === 'm') ? 'Male' : 'Female' } }
    })

    return res.status(200).send(response(data.success, data.data, data.msg, { pageInfo: data.pageInfo }))
  },
  find: async (req, res) => {
    const { id } = req.params
    const data = { id }

    if (!isFilled({ id })) return res.status(400).send(response(false, data, 'User id is required'))

    const userExist = await isExists({ id }, 'users')
    if (!userExist) return res.status(400).send(response(false, data, 'User id must be valid data'))

    let toReturn2 = {}
    const userDetailExist = await isExists({ user_id: id }, 'user_details')
    if (!userDetailExist) {
      toReturn2 = {
        name: '',
        birthdate: '',
        phone: '',
        gender: ''
      }
    } else {
      toReturn2 = userDetailExist
    }

    return res.status(200).send(response(true, { ...userExist, ...{ biodata: toReturn2 } }))
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
