const { verifyToken } = require('./jwt')
const { getAllUser } = require('./data')

const foundUser = (uid) => {
  if (!uid) return false

  const users = getAllUser()
  const usersUid = Object.keys(users)

  return usersUid.includes(uid)
}

const auth = (req, res, next) => {
  const authHeader = req.headers?.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader && authHeader.split(' ')[1]
  const verify = verifyToken(token)

  if (!verify.valid) {
    return res.status(401).send({ message: 'Invalid or expired token' });
  }

  if (!foundUser(verify.data.userUid)) {
    return res.status(403).send({ message: 'User not found' });
  }

  req.user = verify

  next()
}

const delay = (time = 300) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

module.exports = {
  auth,
  delay,
}
