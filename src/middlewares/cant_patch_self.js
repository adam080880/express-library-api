const response = require('../utils/response')

module.exports = (req, res, next) => {
  if (parseInt(req.params.id) === parseInt(req.me.id)) return res.status(400).send(response(false, { id: req.params.id }, 'Can\'t self toggle patch'))
  else next()
}
