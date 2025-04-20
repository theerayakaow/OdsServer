const jwt = require('jsonwebtoken')

const secret = 'shhhhhhhhhh'

const threeMin = 5 * 60

const generateToken = (payload) => {
  return jwt.sign(payload, secret, {
    expiresIn: threeMin,
  })
}

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, secret)
    return {
      valid: true,
      error: null,
      data: payload,
    }
  } catch (err) {
    return {
      valid: false,
      data: null,
      error: err,
    }
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
