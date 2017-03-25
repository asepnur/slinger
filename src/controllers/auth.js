const models = require('../models'),
    sequelize = models.sequelize,
	md5 = require('md5'),
    template = require('../templates/v1')

module.exports = {
    login : (req, res, next) => {
        // check session
        if(req.session.user) {
            return template.status(200, 'already logged in', req, res)
        }

        // request validation
        let email = req.body.email
        let password = md5(req.body.password)
        if(!email || !password) {
            return template.err(400, 'bad request', req, res)
        }

        // authenticate
        models.user.findOne({
            where: { 
                email: email,
                password: password
            }
        }).then((user) => {
            if(!user) {
                return template.err(403, 'not authorized', req, res)
            }
            req.session.user = user
            return template.status(200, 'login success', req, res)
        })
    },
    logout : (req, res, next) => {
        // check session
        if(!req.session.user){
            return template.status(400, 'bad request', req, res)
        }

        // destroy session
        req.session.destroy()
        return template.status(200, 'logout success', req, res)
    }
}