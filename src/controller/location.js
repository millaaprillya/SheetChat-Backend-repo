const { patchUser } = require('../model/auth')
const helper = require('../helper/response')

module.exports = {
  pacthlocation: async (request, response) => {
    const { id } = request.params
    try {
      const setData = {
        user_lat: request.body.user_lat,
        user_lng: request.body.user_lng,
        user_update_at: new Date()
      }
      const result = await patchUser(setData, id)
      return helper.response(response, 201, 'Location Updated', result)
    } catch (error) {
      console.log(error)
    }
  }
}
