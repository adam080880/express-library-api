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

    if (!isFilled({ name, description })) return res.status(400).send(response(false, req.body, 'Name and description must be filled'))

    const result = await authorModel.create({ name, description })
    if (result) return res.status(201).send(response(true, req.body, 'Author successfully created'))
    else return res.status(500).send(response(false, req.body, 'Server Error or Error not handled'))
  },
  patch: async (req, res) => {
    const { id } = req.params
    const { name, description } = req.body

    const data = { ...req.body, ...{ id } }

    if (!isFilled({ id, name, description })) return res.status(400).send(response(false, data, 'ID, Name, and description must be filled'))

    const isExistAuthor = await isExists({ id }, 'authors')
    if (!isExistAuthor) return res.send(response(false, data, 'Author id is not valid'))

    const result = await authorModel.update([{ name, description }, { id }])
    if (result) return res.send(response(true, data, 'Author successfully updated'))
    else return res.status(500).send(response(false, data, 'Server Error or Error not handled'))
  },
  delete: async (req, res) => {
    const { id } = req.params

    const data = { id }

    if (!isFilled({ id })) return res.status(400).send(response(false, { id }, 'ID must be filled'))

    const isExistAuthor = await isExists({ id }, 'authors')
    if (!isExistAuthor) return res.status(400).send(response(false, data, 'Author id is not valid'))

    const result = await authorModel.delete({ id })
    if (result) return res.send(response(true, data, 'Author successfully deleted'))
    else return res.status(500).send(response(false, data, 'Server Error or Error not handled'))
  }
}
