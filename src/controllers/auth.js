let models = require('../models'),
	md5 = require('md5'),
    template = require('../templates/v1')

module.exports = {
    login : (req, res, next) => {
        if(!req.session.user) {
            try {
                let email = req.body.email,
                    password = md5(req.body.password)
                if(!email || !password) throw badrequest
                models.user.findOne({ where: { email: email, password: password }}).then((user) => {
                    if(!user) throw badrequest
                    else {
                        req.session.user = user
                        template.status(200, 'login success', req, res)
                    }
                })
            } catch (e) {
                template.err(500, 'badrequest', req, res)
            }
        }
    }
}