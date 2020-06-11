const response = require('../utils/response')

const {isExists} = require('../utils/validator')

module.exports = async (req, res, next) => {
  const data = await isExists({ id: req.me.id }, 'users')
  if (parseInt(data.role_id) !== 2) {
    return res.status(403).send(response(false, req.body, 'This action need specific role'))
  } else next()
}
