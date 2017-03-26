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
		STATUS_CONVERSATION_SCHEDULE = 2,
		STATUS_CONVERSATION_GRADE = 3
		
const 	TOPIC_GRADE = 'grade',
		TOPIC_LOGIN = 'login',
		TOPIC_LOGOUT = 'logout',
		TOPIC_SCHEDULE = 'schedule',
		TOPIC_COURSE = 'course',
		TOPIC_SCHOLARSHIP = 'scholarship'

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
	session.topic.name = null
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

const scholarship = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	session.topic.name = null
	models.sequelize.query('SELECT * FROM scholarships WHERE end_date > now() ORDER BY end_date ASC LIMIT 5', {
		model : models.scholarship
	}).then((scholarship) => {
		session.topic.name = null
		message = MessageRender(scholarship, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_SCORE)
		conversation.push(message)
		return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
	})
}

// belum
const attendance = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	session.topic.name = null
	models.sequelize.query('SELECT * FROM scholarships WHERE end_date > now() ORDER BY end_date ASC LIMIT 5', {
		model : models.scholarship
	}).then((scholarship) => {
		message = MessageRender(scholarship, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_SCORE)
		conversation.push(message)
		return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
	})
}

const grade = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	if(session.topic.name != TOPIC_GRADE) {
		session.topic = {
			name : TOPIC_GRADE,
			level : 1
		}
	}
	switch (session.topic.level) {
		case 1:
			session.topic.level = 2
			message = MessageRender(`What's the course do you want to check? Here is courses do u have`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
			conversation.push(message)
			models.sequelize.query('SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM user_course WHERE user_id = :user_id)', {
				replacements: {
					user_id : session.user.user_id
				},
				model : models.course
			}).then((courses) => {
				if (courses.length <= 0){
					message = MessageRender(`You dont have any course`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				}
				const courseArr = courses.map((c) => {
					return c.name
				})
				let courseString = courseArr.join(', ')
				message = MessageRender(courseString, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
				conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
			})
			break
		case 2:
			models.sequelize.query('SELECT * FROM courses WHERE name = :course_name LIMIT 1', {
				replacements: {
					course_name : text
				},
				model : models.course
			}).then((course) => {
				if (course.length <= 0){
					message = MessageRender(`Course not found. What course do you want to check`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				}
				return new Promise((resolve) =>{
					resolve(course[0])
				})
			}).then((course) => {
				models.sequelize.query('SELECT * FROM grades WHERE user_id = :user_id AND course_id = :course_id', {
					replacements: {
						user_id : session.user.user_id,
						course_id : course.course_id
					},
					type: models.sequelize.QueryTypes.SELECT
				}).then((grades) => {
					session.topic.name = null
					if (grades.length <= 0){
						message = MessageRender(`Sorry. You dont have any grade for this course`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_GRADE)
						conversation.push(message)
						return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
					}
					message = MessageRender(grades, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_GRADE)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				})
			})
	}
}


module.exports = {
	index : (req,res,next) => {
		if (!req.session.conversation){
			req.session.conversation = new Array
			req.session.topic = {
				name: null,
				level: 1
			}
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

		if (!req.session.topic.name){
			req.session.topic.name = text
		}

		switch(req.session.topic.name){
			case TOPIC_LOGOUT:
				return auth(req.session, text, req, res)
			case TOPIC_LOGIN:
				return auth(req.session, text, req, res)
			case TOPIC_SCHEDULE:
				return schedule(req.session, text, req, res)
			case `score`:
				return score(req.session, text, req, res)
			case TOPIC_SCHOLARSHIP:
				return scholarship(req.session, text, req, res)
			case TOPIC_GRADE:
				return grade(req.session, text, req, res)
			default:
				req.session.topic.name = null
				const message = MessageRender(`Sorry, I don't understand what do u mean brother. Now, my feature just only for checking schedule and score`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
				req.session.conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, req.session.conversation, req, res)
		}
		return template.status(200, 'lewat', req, res)
	}
}