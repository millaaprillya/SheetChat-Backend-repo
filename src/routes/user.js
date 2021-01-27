const router = require('express').Router()
// const uploadImage = require('../middleware/multer')
// // const { authRecruiter } = require('../middleware/auth')
const {
  login,
  register,
  // postImage,
  userByid,
  searchUser,
  settings
} = require('../controller/user')
const { addfriends, getFriends } = require('../controller/friends')
const {
  createRoom,
  getListRoom,
  getRoomById,
  getMessageByRoom
} = require('../controller/message')
const { pacthlocation } = require('../controller/location')
// ===> user <===
router.get('/search', searchUser)
router.get('/:id', userByid)
router.post('/register', register)
router.post('/login', login)
router.patch('/:id', settings)
// router.patch('/:id', uploadImage)

// ==> location User <==
router.patch('/location/:id', pacthlocation)
// ==> friends <==
router.get('/friends/:id', getFriends)
router.post('/addfriends', addfriends)
// router.post('/image', uploadImage, postImage)

// ==> Chat <==
router.get('/chat/:id', getMessageByRoom)
router.get('/postChat', getMessageByRoom)
// ==> room <==
router.post('/create', createRoom)
router.get('/list/:id', getListRoom)
router.get('/byid/room', getRoomById)

module.exports = router
