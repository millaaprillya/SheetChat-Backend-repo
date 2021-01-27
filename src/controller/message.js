const helper = require('../helper/response')
const {
  getMessageByRoom,
  createRoom,
  checkRoom,
  getListRoom,
  getRecentMessage,
  getRoomById
} = require('../model/Message')
const { getUserByIdModel } = require('../model/auth')

module.exports = {
  getMessageByRoom: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getMessageByRoom(id)
      return helper.response(response, 200, 'Get Messages Success', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  createRoom: async (request, response) => {
    const { sender_id, receiver_id, message } = request.body
    console.log(request.body)
    try {
      const setData = {
        room_id: Math.floor(Math.random() * 1000),
        sender_id,
        receiver_id,
        message,
        room_created_at: new Date()
      }

      const setData2 = {
        room_id: setData.room_id,
        sender_id: setData.receiver_id,
        receiver_id: setData.sender_id,
        room_created_at: new Date()
      }

      const checkDataRoom = await checkRoom(
        setData.sender_id,
        setData.receiver_id
      )
      console.log(checkDataRoom)
      if (checkDataRoom.length > 0) {
        return helper.response(response, 400, 'Room already exist')
      } else {
        const result = await createRoom(setData)
        const result2 = await createRoom(setData2)
        console.log(result2)
        return helper.response(response, 200, 'Room Created', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  getListRoom: async (request, response) => {
    const { id } = request.params
    try {
      console.log(request.body)
      const result = await getListRoom(id)
      for (let i = 0; i < result.length; i++) {
        const userData = await getUserByIdModel(result[i].receiver_id)
        console.log(userData)
        result[i].user_name = userData[0].user_name
        result[i].user_image = userData[0].user_image
        const recentMsg = await getRecentMessage(result[i].room_id)
        console.log(recentMsg)
        if (recentMsg.length > 0) {
          result[i].user_msg = recentMsg[0].msg_body
        } else {
          result[i].user_msg = 'Start Messaging'
        }
      }
      return helper.response(response, 200, 'Get All List Room', result)
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad Request')
    }
  },
  getRoomById: async (request, response) => {
    const { room_id, sender_id } = req.query
    try {
      const result = await getRoomById(room_id, sender_id)

      const userData = await getUserByIdModel(result[0].receiver_id)
      result[0].user_name = userData[0].user_name
      result[0].user_image = userData[0].user_image

      const getMessage = await getMessageByRoom(room_id)
      result[0].messages = getMessage

      return helper.response(response, 200, 'Get Room By Room ID', result[0])
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  }
}
