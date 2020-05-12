const response = require('../utils/response')
const { isFilled, isExists } = require('../utils/validator')
const authorModel = require('../models/author')

module.exports = {
  get: async (req, res) => {
    const authors = await authorModel.get()
    res.send(response(true, authors, 'List of all authors'))
  },
  post: async (req, res) => {
    const { name, description } = req.body

    if (!isFilled({ name, description })) return res.send(response(false, req.body, 'Name and Description must be filled'))

    const result = await authorModel.create({ name, description })
    if (result) return res.send(response(true, req.body, 'Data has been created'))
    else return res.send(response(false, req.body, 'Server Error or Error not handled'))
  },
  patch: async (req, res) => {
    const { id } = req.params
    const { name, description } = req.body

    if (!isFilled({ id, name, description })) return res.send(response(false, req.body, 'ID, Name, and Description must be filled'))

    const isExistAuthor = await isExists({ id }, 'authors')
    if (!isExistAuthor) return res.send(response(false, req.body, 'Author id is not valid'))

    const result = await authorModel.update([{ name, description }, { id }])
    if (result) return res.send(response(true, req.body, 'Data has been updated'))
    else return res.send(response(false, req.body, 'Server Error or Error not handled'))
  },
  delete: async (req, res) => {
    const { id } = req.params

    if (!isFilled({ id })) return res.send(response(false, { id }, 'ID must be filled'))

    const isExistAuthor = await isExists({ id }, 'authors')
    if (!isExistAuthor) return res.send(response(false, req.params, 'Author id is not valid'))

    const result = await authorModel.delete({ id })
    if (result) return res.send(response(true, req.params, 'Data has been deleted'))
    else return res.send(response(false, req.params, 'Server Error or Error not handled'))
  }
}
