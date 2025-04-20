const express = require('express')
const bodyParser = require('body-parser')

const { generateToken } = require('./utils/jwt')
const { auth, delay } = require('./utils/middleware')
const { getUserData, getCreditBalance, addTransaction, canWithdraw } = require('./utils/data')

const { createOtpRequest, verifyOtp, getLatestEntry, clearExpiredEntries } = require('./utils/otp')

const { formatTimeAMPM, COOL_DOWN, getAvatarBase64 } = require('./utils/helper')

const app = express()

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api/v1/request-otp', async (req, res) => {
  clearExpiredEntries()

  const { phone } = req.body
  if (!phone) {
    return res.status(400).send({ message: 'Phone number is required.' })
  }

  const { otpCode } = createOtpRequest(phone)
  await delay(500) // simulate SMS delay

  res.send({ phone, otp: otpCode })
})

app.post('/api/v1/otp-info', (req, res) => {
  clearExpiredEntries()

  const { phone } = req.body
  if (!phone) return res.status(400).send({ message: 'Phone number is required' })

  const entry = getLatestEntry(phone)
  if (!entry) return res.send({})

  const now = Date.now()
  const sent = new Date(entry.last_sent_at).getTime()
  const cooldown = Math.max(0, COOL_DOWN - Math.floor((now - sent) / 1000))
  const formattedOtpExpireAt = entry.otp_expire_at ? formatTimeAMPM(entry.otp_expire_at) : null

  res.send({
    phone_number: entry.phone_number,
    otp_ref_id: entry.otp_ref_id,
    otp_code: entry.otp_code, // dev only
    is_verified: entry.is_verified,
    last_sent_at: entry.last_sent_at,
    otp_expire_at: entry.otp_expire_at,
    formatted_otp_expire_at: formattedOtpExpireAt,
    cooldown,
  })
})

app.post('/api/v1/verify-otp', (req, res) => {
  clearExpiredEntries()

  const { phone, otp } = req.body
  if (!phone || !otp) {
    return res.status(400).send({ message: 'Phone and OTP are required.' })
  }

  const result = verifyOtp(phone, otp)

  if (!result.valid) {
    let message = 'OTP verification failed.'

    switch (result.reason) {
      case 'not_found':
        message = 'No OTP request found for this phone number.'
        break
      case 'not_latest':
        message = 'This code was from an older request. Please use the most recent OTP sent.'
        break
      case 'already_verified':
        message = 'This OTP has already been used.'
        break
      case 'used':
        message = 'This OTP was already used in a previous request.'
        break
      case 'expired':
        message = 'This OTP has expired. Please request a new one.'
        break
      case 'incorrect':
        message = 'The OTP you entered is incorrect.'
        break
    }

    return res.status(400).send({ message })
  }

  const user = getUserData() // mock user
  const token = generateToken({ userUid: user.uid, phone })

  res.send({ token })
})

app.use(auth)

app.get('/api/v1/user/profile', async (req, res) => {
  const userData = req.user
  const userUid = userData.data.userUid

  const user = getUserData(userUid)
  const avatar = getAvatarBase64(userUid)

  res.send({
    user: {
      ...user,
      avatar,
    },
  })
})

app.get('/api/v1/user/transactions', async (req, res) => {
  const userData = req.user
  const userUid = userData.data.userUid

  const creditBalance = getCreditBalance(userUid)

  if (!creditBalance) {
    return res.status(404).send({ message: 'User not found or no credit balance' })
  }

  const sortedTransactions = [...creditBalance.transactions].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('/')
    const [d2, m2, y2] = b.date.split('/')

    const dateA = new Date(`${y1}-${m1}-${d1}`)
    const dateB = new Date(`${y2}-${m2}-${d2}`)

    if (dateA.getTime() === dateB.getTime()) {
      // ถ้าวันเดียวกัน → เรียงตาม uid มากไปน้อย
      return b.uid - a.uid
    }

    return dateB - dateA // เรียงจากวันที่ล่าสุดไปเก่าสุด
  })

  const formattedTransactions = sortedTransactions.map((tx) => {
    const [day, month, year] = tx.date.split('/')
    const dateObj = new Date(`${year}-${month}-${day}`)

    return {
      ...tx,
      formattedDate: dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }
  })

  res.send({
    trans: {
      available: creditBalance.available,
      transactions: formattedTransactions,
    },
  })
})

app.post('/api/v1/user/withdraw', async (req, res) => {
  const { amount } = req.body
  const userUid = req.user.data.userUid

  if (!amount) {
    return res.status(400).send({
      message: 'Please enter the amount you would like to withdraw.',
    })
  }

  const check = canWithdraw(userUid, amount)
  if (!check.allowed) {
    return res.status(400).send({
      message: `You can only withdraw up to ฿${check.limit.toLocaleString()}. Please adjust the amount.`,
    })
  }

  addTransaction(userUid, amount)

  await delay(1000) // Simulate processing delay

  return res.status(200).send({ message: 'Your withdrawal request was successful!' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
