const models = require('../models'),
	md5 = require('md5'),
    template = require('../templates/v1')

module.exports = {
    login : (req, res, next) => {
        // check session
        if(req.session.user) {
            return template.status(200, 'already logged in', req, res)
        }

        // request validation
        if(!req.body.email || !req.body.password) {
            return template.err(400, 'bad request', req, res)
        }
        let email = req.body.email
        let password = md5(req.body.password)
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
            return template.data(200, 'login success', req, res)
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