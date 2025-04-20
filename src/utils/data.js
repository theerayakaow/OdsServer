const fs = require('fs')
const path = require('path')

const userPath = path.resolve(__dirname, '../data/user.json')
const creditBalancePath = path.resolve(__dirname, '../data/creditBalance.json')

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

const JOHN_UID = 'john_uid'
const SERENA_UID = 'serena_uid'

const randomUsers = () => {
  const mockUid = [JOHN_UID, SERENA_UID]
  const index = Math.floor(Math.random() * 2)
  return mockUid[index]
}

const getAllUser = () => {
  const users = readJson(userPath)
  return users
}

const getUserData = (uid) => {
  const users = readJson(userPath)
  if (uid && users[uid]) {
    return { ...users[uid] }
  }

  const random = randomUsers()
  return users[random]
}

const getCreditBalance = (uid) => {
  const creditBalances = readJson(creditBalancePath)
  return creditBalances[uid]
}

const canWithdraw = (uid, amount) => {
  const user = getCreditBalance(uid)
  if (!user) return { allowed: false, reason: 'user_not_found' }

  const limit = user.available / 2
  if (amount > limit) {
    return {
      allowed: false,
      reason: 'exceeds_limit',
      limit,
    }
  }

  return { allowed: true }
}

const addTransaction = (uid, amount) => {
  const creditBalances = readJson(creditBalancePath) // ดึงไฟล์จริง
  const user = creditBalances[uid]
  if (!user) return null

  const maxId = user.transactions.length ? Math.max(...user.transactions.map((t) => t.uid)) : 0

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-GB')

  const newTransaction = {
    uid: maxId + 1,
    amount,
    date: formattedDate,
  }

  user.transactions.push(newTransaction)
  user.available -= amount

  creditBalances[uid] = user
  writeJson(creditBalancePath, creditBalances)

  return newTransaction
}

module.exports = {
  getUserData,
  getAllUser,
  getCreditBalance,
  addTransaction,
  canWithdraw,
}
