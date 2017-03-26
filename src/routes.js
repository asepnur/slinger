const express = require('express'),
      router = express.Router()
      controllers = require('./controllers')

router.post('/v1/login', controllers.auth.login)
router.post('/v1/logout', controllers.auth.logout)
router.post('/v1/messages', controllers.bot.index)

// 404 page
router.get('*', controllers.error.err404)
router.post('*', controllers.error.err404)
router.put('*', controllers.error.err404)
router.patch('*', controllers.error.err404)
router.delete('*', controllers.error.err404)
router.copy('*', controllers.error.err404)
router.head('*', controllers.error.err404)
router.options('*', controllers.error.err404)
router.purge('*', controllers.error.err404)
router.lock('*', controllers.error.err404)
router.unlock('*', controllers.error.err404)
router.move('*', controllers.error.err404)
router.unlock('*', controllers.error.err404)

module.exports = router