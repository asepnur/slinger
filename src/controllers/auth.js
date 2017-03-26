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
        models.sequelize.query('SELECT * FROM users WHERE email = :email AND password = :password LIMIT 1', {
            replacements: {
                email: email,
                password: password 
            },
            model : models.user
        }).then((user) => {
            if (user.length <= 0) {
                return template.data(200, 'login failed', req, res)
            }
            req.session.user = user[0]
            if(req.session.user.image){
                req.session.user.image = '/' + req.session.user.image
            }
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