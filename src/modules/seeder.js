const { hashSync } = require('bcryptjs')

const con = require('../utils/db')

const getPassword = password => hashSync(password)

const data = {
  roles: [
    {
      id: 1,
      role: 'admin'
    },
    {
      id: 2,
      role: 'member'
    }
  ],
  users: [
    {
      id: 1,
      role_id: 1,
      email: 'admin@server.co',
      password: getPassword('helloworld')
    },
    {
      id: 2,
      role_id: 2,
      email: 'member@server.co',
      password: getPassword('helloworld')
    }
  ],
  user_details: [
    {
      user_id: 1,
      name: 'admin',
      birthdate: '2003-03-17',
      phone: '085697324684',
      gender: 'm'
    },
    {
      user_id: 2,
      name: 'member',
      birthdate: '2003-03-17',
      phone: '085697324684',
      gender: 'm'
    }
  ],
  book_statuses: [
    {
      id: 1,
      name: 'available'
    },
    {
      id: 2,
      name: 'booked'
    }
  ],
  transaction_statuses: [
    {
      id: 1,
      name: 'booked'
    },
    {
      id: 2,
      name: 'borrowed'
    },
    {
      id: 3,
      name: 'returned'
    }
  ]
}

Object.keys(data).forEach((val, index) => {
  data[val].forEach((value, index_) => {
    const sql = `INSERT INTO ${val} SET ?`
    con.query(sql, value, (err, res) => {
      if (err) throw Error(err)
      console.log('Success Row', index_)
    })
  })
})
