# my-library-api

This repository is an open source code. Built for libraries that want to handle online transactions and allow member to can show list books and can make a reservation to booking a book.

## Instalation

```
git clone https://github.com/adam080880/my-library-api
```

## Usage

Setting Env:

```
APP_PORT=8080
APP_URL=http://localhost:8080/

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=exp_library

LATE_FINE=5000
SECRET_KEY=(your secret key)
```

first, run the seeder

```
node ./src/modules/seeder
```

and then, run the server

```
nodemon
```

## Standard JSON Response

```
{
  success: (boolean),
  data: (array of object),
  ...optional: (object multi functional with spread operator),
  msg: (string)
}
```

## Routes

### Authenticate

- `POST` /auth/registration
- `POST` /auth/complete_registration -> need JWT Token
- `POST` /auth/login
- `GET` /auth/profile -> need JWT Token
- `PATCH` /auth/profile/edit -> need JWT Token

### Books

- `GET` /books
- `GET` /books/:id
- `GET` /books/popular
- `POST` /books -> need JWT Token -> admin and super admin only
- `PATCH` /books/:id -> need JWT Token -> admin and super admin only
- `DELETE` /books/:id -> need JWT Token -> admin and super admin only

### Author

- `GET` /author
- `POST` /author -> Need: JWT Token, admin and super admin only
- `PATCH` /author/:id -> Need: JWT Token, admin and super admin only
- `DELETE` /author/:id -> Need: JWT Token, admin and super admin only

### Genre

- `GET` /genre
- `POST` /genre -> Need: JWT Token, admin and super admin only
- `PATCH` /genre/:id -> Need: JWT Token, admin and super admin only
- `DELETE` /genre/:id -> Need: JWT Token, admin and super admin only

### User [Need: JWT Token]

- `GET` /user -> super admin and admin
- `GET` /user/member -> super admin and admin
- `GET` /user/member/:id -> super admin and admin
- `PATCH` /toggle/role/:id -> super admin only

### Transaction [Need: JWT Token, admin and super admin only]

- `GET` /transaction
- `PATCH` /transaction/borrow/:id
- `PATCH` /transaction/return/:id

### Transaction Member [Need: JWT Token, Full Biodata, and member only]

- `POST` /member/transaction

### Review Book [Need: JWT Token]

- `POST` /books/review/:book_id
