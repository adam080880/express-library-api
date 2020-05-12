const express = require('express')
const app = express()

require('dotenv').config()
const { APP_PORT } = process.env

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: false
}))

const authorRouter = require('./src/routes/author')
const bookRouter = require('./src/routes/book')
const genreRouter = require('./src/routes/genre')
const transactionMemberRouter = require('./src/routes/transaction_member')
const transactionRouter = require('./src/routes/transaction')
const authRouter = require('./src/routes/auth')

app.use('/author', authorRouter)
app.use('/book', bookRouter)
app.use('/genre', genreRouter)
app.use('/transaction', transactionRouter)
app.use('/member/transaction', transactionMemberRouter)
app.use('/auth', authRouter)

app.listen(APP_PORT, (err) => {
  if (err) throw err
  console.log('Server has been started @port', APP_PORT)
})
