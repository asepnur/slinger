let template = require('../templates/v1')

module.exports = {
	index : (req,res,next) => {
                template.success(200, 'ok', req, res)
	}
}