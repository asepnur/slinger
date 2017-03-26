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
		STATUS_CONVERSATION_SCHEDULE = 1,
		STATUS_CONVERSATION_SCHOLARSHIP = 2,
		STATUS_CONVERSATION_GRADE = 3,
		STATUS_CONVERSATION_ATTENDANCE = 4
		
const 	TOPIC_GRADE = 'grade',
		TOPIC_ATTENDANCE = 'attendance',
		TOPIC_LOGIN = 'login',
		TOPIC_LOGOUT = 'logout',
		TOPIC_SCHEDULE = 'schedule',
		TOPIC_COURSE = 'course',
		TOPIC_SCHOLARSHIP = 'scholarship',
		TOPIC_ABOUT = 'about',
		TOPIC_EXIT = 'exit'

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
	let query
	const conversation = session.conversation
	if(session.topic.name != TOPIC_SCHEDULE) {
		session.topic = {
			name : TOPIC_SCHEDULE,
			level : 1
		}
	}
	switch (session.topic.level) {
		case 1:
			session.topic.level = 2
			message = MessageRender(`What range of schedule do you want to check? Here is the schedule`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
			conversation.push(message)
			message = MessageRender(`Type today or all`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
			conversation.push(message)
			return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
			break
		case 2:
			if (text != 'today' && text != 'all'){
				message = MessageRender(`Please choose today or all. If you want to exit topic, type 'exit'`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
				conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
			}
			if (text === 'today') {
				query = 'SELECT * FROM courses WHERE date = ' + new Date().getDay() + ' AND course_id IN (SELECT course_id FROM user_course WHERE user_id = :user_id)'
			} else {
				query = 'SELECT * FROM courses WHERE course_id IN (SELECT course_id FROM user_course WHERE user_id = :user_id)'
			}
			models.sequelize.query(query, {
				replacements: {
					user_id: session.user.user_id
				},
				model : models.course
			}).then((course) => {
				session.topic.name = null
				if(course.length <= 0){
					message = MessageRender(`Horray! You dont have any schedule today!`, STATUS_CONVERSATION_BOT, img.bot ,STATUS_CONVERSATION_SCHEDULE)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				}
				message = MessageRender(`Here is your schedule!`, STATUS_CONVERSATION_BOT, img.bot ,STATUS_CONVERSATION_SCHEDULE)
				conversation.push(message)
				message = MessageRender(course, STATUS_CONVERSATION_BOT, img.bot ,STATUS_CONVERSATION_SCHEDULE)
				conversation.push(message)
				return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
			})
	}
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

const attendance = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	if(session.topic.name != TOPIC_ATTENDANCE) {
		session.topic = {
			name : TOPIC_ATTENDANCE,
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
					session.topic.name = null
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
			models.sequelize.query('SELECT * FROM courses WHERE lower(name) = :course_name LIMIT 1', {
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
				models.sequelize.query('SELECT * FROM attendances WHERE user_id = :user_id AND course_id = :course_id', {
					replacements: {
						user_id : session.user.user_id,
						course_id : course[0].course_id
					},
					type: models.sequelize.QueryTypes.SELECT
				}).then((grades) => {
					session.topic.name = null
					if (grades.length <= 0){
						message = MessageRender(`Sorry. You dont have any attendance for this course`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_GRADE)
						conversation.push(message)
						return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
					}
					message = MessageRender(grades, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_ATTENDANCE)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				})
			})
			break
	}
}

const about = (session, text, req, res) => {
	let message
	const conversation = session.conversation
	message = MessageRender(`Hello I'm Fascal v0.0.1! Builded by Fahmi, Asep, and Ical in order to join COIN, Please enjoy my service!`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
	conversation.push(message)
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
					session.topic.name = null
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
			models.sequelize.query('SELECT * FROM courses WHERE lower(name) = :course_name LIMIT 1', {
				replacements: {
					course_name : text
				},
				model : models.course
			}).then((course) => {
				if (course.length <= 0){
					message = MessageRender(`Course not found. What course do you want to check? or type 'exit' to exit the topic`, STATUS_CONVERSATION_BOT, img.bot, STATUS_CONVERSATION_NOACTION)
					conversation.push(message)
					return template.conversation(200, STATUS_NO_ACTION, session.conversation, req, res)
				}
				models.sequelize.query('SELECT * FROM grades WHERE user_id = :user_id AND course_id = :course_id', {
					replacements: {
						user_id : session.user.user_id,
						course_id : course[0].course_id
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
			break
	}
}

const exit = (session, text, req, res) => {
	if (session.topic.name === TOPIC_EXIT){
		req.session.topic.name = null
		const message = MessageRender(`Sorry, you are not in any topic`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
		req.session.conversation.push(message)
		return template.conversation(200, STATUS_NO_ACTION, req.session.conversation, req, res)	
	}
	req.session.topic.name = null
	const message = MessageRender(`Successfully exiting topic`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
	req.session.conversation.push(message)
	return template.conversation(200, STATUS_NO_ACTION, req.session.conversation, req, res)
}

const unhandeld = (session, text, req, res) => {
	req.session.topic.name = null
	const message = MessageRender(`Sorry, I don't understand what do u mean brother. Now, my feature just only for checking schedule and score`, STATUS_CONVERSATION_BOT, img.bot, STATUS_NO_ACTION)
	req.session.conversation.push(message)
	return template.conversation(200, STATUS_NO_ACTION, req.session.conversation, req, res)
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
			text.toLowerCase()
		}

		// auth
		if(!req.session.user){
			return auth(req.session, text, req, res)
		}

		if (!req.session.topic.name || text === TOPIC_EXIT){
			req.session.topic.name = text
		}

		switch(req.session.topic.name){
			case TOPIC_LOGOUT:
				return auth(req.session, text, req, res)
			case TOPIC_LOGIN:
				return auth(req.session, text, req, res)
			case TOPIC_SCHEDULE:
				return schedule(req.session, text, req, res)
			case TOPIC_SCHOLARSHIP:
				return scholarship(req.session, text, req, res)
			case TOPIC_GRADE:
				return grade(req.session, text, req, res)
			case TOPIC_ABOUT:
				return about(req.session, text, req, res)
			case TOPIC_ATTENDANCE:
				return attendance(req.session, text, req, res)
			case TOPIC_EXIT:
				return exit(req.session, text, req, res)
			default:
				return unhandeld(req.session, text, req, res)
		}
		return template.status(500, 'internal server error', req, res)
	}
}