const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const SECRET = process.env.SECRET
class UserController {
  static register (req, res, next) {
    let data = {
      username: req.body.username,
      email:  req.body.email,
      password: req.body.password
    }
    User
      .create(data)
      .then( user => {
        let data = {
          id: user.id,
          username: user.username,
          email: user.email
        }
        res.status(201).json({
          msg: 'User register success',
          data
        })
      })
      .catch(next)
  }

  static login (req, res, next) {
    User
      .findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
        if (user) {
          const isValid = bcrypt.compareSync(req.body.password, user.password)
          if(isValid) {
            const payload = {
              id: user.id,
              username: user.username,
              email: user.email
            }
            const token = jwt.sign(payload, 'indomie')
            res.status(200).json({
              msg: 'Login Success',
              token
            })
          } else {
            next({
              name: 'LoginFailed',
              msg: 'Wrong Email/Password !',
              status: 400
            })
          }
        } else {
          next({
            name: 'LoginFailed',
            msg: 'Wrong Email/Password !',
            status: 400
          })
        }
      })
      .catch(next)
  }
}

module.exports = UserController