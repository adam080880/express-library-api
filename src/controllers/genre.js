const response = require('../utils/response')
const { isFilled, isExists } = require('../utils/validator')
const genreModel = require('../models/genre')

module.exports = {
  get: async (req, res) => {
    const genres = await genreModel.get()
    res.status(200).send(response(true, genres, 'List of all genres'))
  },
  post: async (req, res) => {
    const { name } = req.body
    if (!isFilled({ name })) return res.status(400).send(response(false, req.body, 'Name must be filled'))

    const existGenre = await isExists({ name }, 'genres')
    if (existGenre) return res.status(400).send(response(false, req.body, 'Genre is exists'))

    const result = genreModel.create({ name })
    if (result) return res.status(201).send(response(true, req.body, 'Genre successfully created'))
    else return res.status(500).send(response(false, req.body, 'Server Error or Error not handled'))
  },
  patch: async (req, res) => {
    const { name } = req.body
    const { id } = req.params

    const data = { ...req.body, ...{ id } }

    if (!isFilled({ name, id })) return res.status(400).send(response(false, data, 'Name and id must be filled'))

    const existGenre = await isExists({ id }, 'genres')
    if (!existGenre) return res.status(400).send(response(false, data, 'Genre id is not valid'))

    const result = genreModel.update([{ name }, { id }])
    if (result) return res.status(200).send(response(true, data, 'Genre successfully updated'))
    else return res.status(500).send(response(false, data, 'Server Error or Error not handled'))
  },
  delete: async (req, res) => {
    const { id } = req.params

    const data = { id }

    if (!isFilled({ id })) return res.status(400).send(response(false, data, 'ID must be filled'))

    const existGenre = await isExists({ id }, 'genres')
    if (!existGenre) return res.status(400).send(response(false, data, 'Genre id is not valid'))

    const result = genreModel.delete({ id })
    if (result) return res.status(200).send(response(true, data, 'Genre successfully deleted'))
    else return res.status(500).send(response(false, data, 'Server Error or Error not handled'))
  }
}
