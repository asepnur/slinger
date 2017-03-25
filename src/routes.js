let express = require('express'),
    router = express.Router()
    controllers = require('./controllers')

router.post('/v1/login', controllers.user.index)
router.post('/v1/messages', controllers.bot.listen())
router.get('*', controllers.error.err404)
// router.get('/create', controllers.Create.index)
// router.post('/pcreate',controllers.Create.create)
// router.get('/edit/:product/:idb',controllers.Edit.bundle)
// router.get('/edit/:product',controllers.Edit.product)
// router.post('/pEditProduct',controllers.Edit.pEditProduct)
// router.post('/pEditBundle',controllers.Edit.pEditBundle)

module.exports = router