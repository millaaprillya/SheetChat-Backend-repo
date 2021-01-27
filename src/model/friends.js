const connection = require('../config/mysql')

module.exports = {
  addFriends: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO friends SET ?', data, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          console.log(error)
          reject(new Error(error))
        }
      })
    })
  },
  checklistFriends: (account) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT friends_id FROM user WHERE user_id = ?',
        account,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getListFriend: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT friends_id, user_name, user_email, user_phone, user_image FROM friends JOIN user ON friends.friends_id = user.user_id WHERE friends.user_id = ?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
