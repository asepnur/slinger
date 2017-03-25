let template = require('../templates/v1')

module.exports = {
    err404 : (req, res, next) => {
        template.err(404, 'kacau bung', req, res)
	}
}