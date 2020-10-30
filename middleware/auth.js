const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token')
  console.log(token)

  if (!token) {
    return res.status(401).json({ msg: 'No token, auth denied' })
  }

  try {
    const decoded = jwt.verif(token, config.get('jwtSecret'))

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' })
  }
}