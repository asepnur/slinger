let template = require('../templates/v1'),
	models = require('../models')

module.exports = {
	index : (req,res,next) => {
		if(!req.session.user){
			return template.status(400, 'bad request', req, res)
		}
		models.user.findById(req.session.user.user_id).then((user) => new Promise((resolve, reject) => {
			resolve(user)
		})). then((user) => {
			return template.data(200, user, req, res)
		})
	}
}