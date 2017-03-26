const 	template = require('../templates/v1'),
		models = require('../models'),
		img = require('../utils/image')

// action status
const 	STATUS_NO_ACTION = 0,
		STATUS_LOGIN = 1

// conversation status
const 	STATUS_CONVERSATION_BOT = 0,
		STATUS_CONVERSATION_USER = 1

// conversation action
const 	STATUS_CONVERSATION_NOACTION = 0,
		STATUS_CONVERSATION_SCORE = 1,
		STATUS_CONVERSATION_SCHEDULE = 2

const MessageRender = (data, sender, image, action) => {
	const message = {
		date : Date.now(),
		user: sender,
		data: data,
		action : STATUS_CONVERSATION_NOACTION,
		image: image
	}
	
	if(action) {
		message.action = action
	}
	return message
}

const schedule = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	models.sequelize.query('SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM user_course WHERE user_id = :user_id)', {
		replacements: {
			user_id : req.session.user.user_id
		},
		model : models.course
	}).then((course) => {
		message = MessageRender(course, STATUS_CONVERSATION_BOT, img.bot ,STATUS_CONVERSATION_SCHEDULE)
		conversation.push(message)
		return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
	})
}

const score = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	models.sequelize.query('SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM user_course WHERE user_id = :user_id)', {
		replacements: {
			user_id : req.session.user.user_id
		},
		model : models.course
	}).then((course) => {
		message = MessageRender(course, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_SCORE)
		conversation.push(message)
		return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
	})
}

const auth = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	if(!session.welcome){
		message = MessageRender(`Hello I'm Fascal, you can ask me about practicuum`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
		conversation.push(message)
		session.welcome = true
	}
	switch (text){
		case 'login':
			if(session.user){
				message = MessageRender(`You have already logged in`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
				conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
			}
			return template.conversation(200, STATUS_LOGIN, session.conversation, req, res)
		case 'logout':
			message = (session.user) ? MessageRender(`logout success`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION) : MessageRender(`You have already logged out`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
			conversation.push(message)
			session.user = null
			return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
		default:
			message = MessageRender(`To use my service, please type login`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
			conversation.push(message)
			return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
	}
}

module.exports = {
	index : (req,res,next) => {
		if (!req.session.conversation){
			req.session.conversation = new Array
		}
		const text = req.body.text || ''

		// check if has a text
		if (text) {
			const image = (req.session.user) ? req.session.user.image : img.boy
			const message = MessageRender(text, STATUS_CONVERSATION_USER, image, STATUS_CONVERSATION_NOACTION)
			req.session.conversation.push(message)
		}

		// auth
		if(!req.session.user){
			return auth(req.session, text, req, res)
		}

		switch(text){
			case `logout`:
				return auth(req.session, text, req, res)
			case `login`:
				return auth(req.session, text, req, res)
			case `schedule`:
				return schedule(req.session, text, req, res)
			case `score`:
				return score(req.session, text, req, res)
			default:
				message = MessageRender(`Sorry, I don't understand what do u mean brother. Now, my feature just only for checking schedule and score`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
				conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
		}
		return template.status(200, 'lewat', req, res)
	}
}