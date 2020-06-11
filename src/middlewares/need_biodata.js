const response = require('../utils/response')

module.exports = (req, res, next) => {
  if (req.me.bio === null || !req.me.bio) {
    return res.status(403).send(response(false, req.body, 'Complete biodata please'))
  } else next()
}
