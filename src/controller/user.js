const {
  loginCheckModel,
  registerUserModel,
  getUserByIdModel,
  searchByEmail,
  patchUsertModel
} = require('../model/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../helper/response')

module.exports = {
  login: async (request, response) => {
    try {
      const { user_email, user_password } = request.body
      console.log(request.body)

      if (request.body.user_email === '') {
        return helper.response(response, 400, 'Insert email Please :)')
      } else if (request.body.user_password === '') {
        return helper.response(response, 400, 'Insert Password Please :)')
      } else {
        const checkDataUser = await loginCheckModel(user_email)
        console.log(checkDataUser)
        if (checkDataUser.length > 0) {
          const checkPassword = bcrypt.compareSync(
            user_password,
            checkDataUser[0].user_password
          )
          console.log(checkPassword)
          if (checkPassword) {
            const {
              user_id,
              user_name,
              user_email,
              user_role
            } = checkDataUser[0]
            const paylot = {
              user_id,
              user_name,
              user_email,
              user_role
            }
            const token = jwt.sign(paylot, 'KERJAIN', { expiresIn: '10h' })
            const result = { ...paylot, token }
            return helper.response(response, 200, 'Succes Login ', result)
          } else {
            return helper.response(response, 404, 'wrong password !')
          }
        } else {
          return helper.response(response, 404, 'account not register !')
        }
      }
    } catch (error) {
      return helper.response(response, 404, 'bad request', error)
    }
  },
  register: async (request, response) => {
    try {
      console.log(request.body)
      const { user_name, user_email, user_password } = request.body

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(user_password, salt)
      const setData = {
        user_name,
        user_email,
        user_password: encryptPassword
      }
      const checkDataUser = await loginCheckModel(user_email)
      console.log(request.body.user_email)
      if (checkDataUser.length >= 1) {
        return helper.response(response, 400, 'Email has been register :((')
      } else if (request.body.user_email === '') {
        return helper.response(response, 400, 'Insert EMAIL Please :))')
      } else if (request.body.user_email.search('@') < 1) {
        return helper.response(
          response,
          400,
          'Email not valid  !!, must be @ s'
        )
      } else if (
        request.body.user_password < 8 ||
        request.body.user_password > 16
      ) {
        return helper.response(
          response,
          400,
          'Password must be 8 - 16 characters '
        )
      } else if (request.body.user_password === '') {
        return helper.response(response, 400, 'Insert Password Please')
      } else {
        const result = await registerUserModel(setData)
        return helper.response(response, 200, 'ok', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  userByid: async (req, res) => {
    const { id } = req.params
    try {
      const result = await getUserByIdModel(id)
      return helper.response(res, 200, 'Get User by Id Success', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request')
    }
  },
  searchUser: async (req, res) => {
    const { email } = req.query
    try {
      const result = await searchByEmail(email)
      if (result.length > 0) {
        return helper.response(res, 200, `Found ${result.length} user`, result)
      } else {
        return helper.response(res, 404, 'User Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request')
    }
  },
  settings: async (request, response) => {
    try {
      console.log(request.body)
      const { id } = request.params
      let {
        user_name,
        user_phone,
        user_email,
        user_bio,
        user_lat,
        user_lng
      } = request.body
      const checkUser = await getUserByIdModel(id)
      console.log(checkUser)
      if (checkUser.length > 0) {
        if (user_email === '') {
          user_email = checkUser[0].user_email
        }
        if (user_name === '') {
          user_name = checkUser[0].user_name
        }
        if (user_phone === '') {
          user_phone = checkUser[0].user_phone
        }
        if (user_bio === '') {
          user_phone = checkUser[0].user_bio
        }
        const setData = {
          user_name,
          user_phone,
          user_email,
          user_bio,
          user_lat,
          user_lng,
          user_update_at: new Date()
        }
        const result = await patchUsertModel(id, setData)
        return helper.response(response, 200, 'Succes Update Data', result)
      } else {
        return helper.response(response, 404, `Data Not Found By Id ${id}`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Data Failed Update', error)
    }
  }
}
