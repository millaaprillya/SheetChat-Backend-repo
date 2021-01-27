const connection = require('../config/mysql')

module.exports = {
  insertMessage: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO messages SET ?', data, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getMessageByRoom: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM messages WHERE room_id = ?',
        id,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : console.log(error)
        }
      )
    })
  },
  createRoom: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO room SET ?', setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData
          }
          resolve(newResult)
        } else {
          console.log(error)
          reject(new Error(error))
        }
      })
    })
  },
  checkRoom: (sender, receiver) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM room WHERE sender_id = ${sender} AND receiver_id = ${receiver}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getListRoom: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE sender_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getRoomById: (room_id, sender_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE room_id = ? AND sender_id = ?',
        [room_id, sender_id],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getRecentMessage: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM messages WHERE room_id = ? ORDER BY msg_created_at DESC LIMIT 1',
        id,
        (error, result) => {
          !error ? resolve(result) : console.log(error)
        }
      )
    })
  }
}
