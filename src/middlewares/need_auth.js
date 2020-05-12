const jsonWebToken = require('jsonwebtoken')
require('dotenv').config()

const response = require('../utils/response')

module.exports = (req, res, next) => {
  const { SECRET_KEY } = process.env

  try {
    const me = jsonWebToken.verify(req.header('Authorization') || req.query._token || req.body._token, SECRET_KEY)
    req.me = me.user
  } catch (e) {
    return res.status(403).send(response(false, req.body, 'This access need authorization'))
  }

  next()
}
