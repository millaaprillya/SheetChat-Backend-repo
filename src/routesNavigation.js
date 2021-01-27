const router = require('Express').Router()
// ==> user <==
const user = require('./routes/user')
router.use('/user', user)

module.exports = router
