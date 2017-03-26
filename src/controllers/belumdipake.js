// import package
const builder = require('botbuilder'),
      luisconf = require('../../config/luis.json'),
      models = require('../models')

// LUIS Init
const recognizer = new builder.LuisRecognizer(luisconf.url),
      intents = new builder.IntentDialog({ recognizers: [recognizer] }),
      connector = new builder.ChatConnector(),
      bot = new builder.UniversalBot(connector)
bot.recognizer(recognizer)

// ================================================= //
// =================== BOT ROUTE =================== //
// ================================================= //

// BOT and intent configuration
intents.matches('ShowSchedule','/schedule')
intents.matches('ShowScore', '/score')
bot.dialog('/', intents)

// BOT dialog
bot.dialog('/schedule', [
    (session, args, next) => {
        console.log(session)
        // authenticate
        models.user.findOne({
            where: { 
                email: 'risal@live.com',
                password: 'e10adc3949ba59abbe56e057f20f883e'
            }
        }).then((user) => {
            session.send(user.email)
            session.endDialog()
        })
    }
])

bot.dialog('/score', [
    function (session, args, next) {
        session.send('yes you ask me about score')
        session.endDialog()
    }
])

module.exports = connector

// ====================== END ====================== //