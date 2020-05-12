const response = require('../utils/response')
const { isFilled, isExists } = require('../utils/validator')
const bookModel = require('../models/book')
const pagination = require('../utils/pagination')

require('dotenv').config()

const fs = require('fs')

module.exports = {
  get: async (req, res) => {
    const data = await pagination(req.query, bookModel, 'books', 'book')
    return res.status(200).send(data)
  },
  getOne: async (req, res) => {
    const { id } = req.params
    const { APP_URL } = process.env

    const data = await bookModel.getOne({ id })
    const result = { data: { ...data.data, ...{ image: `${APP_URL}public/uploads/books/` + data.data.image } }, histories: data.histories }
    return res.status(200).send(result)
  },
  post: async (req, res) => {
    const { title, description, genre_id: genreId, author_id: authorId } = req.body

    if (!isFilled({ title, description, genreId, authorId, file: req.file })) {
      return res.status(400).send(response(false, req.body, 'Title, description, file, genre_id, and author_id must be filled'))
    }

    const genreExists = await isExists({ id: genreId }, 'genres')
    const authorExists = await isExists({ id: authorId }, 'authors')
    if (!genreExists || !authorExists) {
      return res.status(400).send(response(false, req.body, 'Genre_id or author_id must be valid data'))
    }

    const result = bookModel.create({ title, description, genre_id: genreId, author_id: authorId, image: req.file.filename, book_status_id: 1 })
    if (result) return res.status(201).send(response(true, req.body, 'Data has been created'))
    else res.status(500).send(response(false, req.body, 'Internal server error or unhandled error'))
  },
  patch: async (req, res) => {
    const { id } = req.params
    const { title, description, genre_id: genreId, author_id: authorId } = req.body

    if (!isFilled({ title, description, genreId, authorId, id })) {
      return res.status(400).send(response(false, req.body, 'Title, description, genre_id, and author_id must be filled'))
    }

    const bookExists = await isExists({ id }, 'books')
    const genreExists = await isExists({ id: genreId }, 'genres')
    const authorExists = await isExists({ id: authorId }, 'authors')
    if (!genreExists || !authorExists || !bookExists) {
      return res.status(400).send(response(false, req.body, 'Genre_id or book_id or author_id must be valid data'))
    }

    let image = bookExists.image
    if (req.file) {
      try {
        await fs.unlinkSync(`public/uploads/books/${image}`)
        image = req.file.filename
      } catch (e) {
        throw Error(e)
      }
    }

    const result = bookModel.update([{ title, description, genre_id: genreId, author_id: authorId, image, book_status_id: 1 }, { id }])
    if (result) return res.status(200).send(response(true, req.body, 'Data has been updated'))
    else res.status(500).send(response(false, req.body, 'Internal server error or unhandled error'))
  },
  delete: async (req, res) => {
    const { id } = req.params

    if (!isFilled({ id })) {
      return res.status(400).send(response(false, req.body, 'book_id must be filled'))
    }

    const bookExists = await isExists({ id }, 'books')
    if (!bookExists) {
      return res.status(400).send(response(false, req.body, 'Book_id must be valid data'))
    }

    try {
      await fs.unlinkSync(`public/uploads/books/${bookExists.image}`)
    } catch (e) {
      throw Error(e)
    }

    const result = await bookModel.delete({ id })
    if (result) return res.status(200).send(response(true, req.body, 'Data has been deleted'))
    else return res.status(500).send(response(false, req.body, 'Internal server error or unhandled error'))
  }
}
