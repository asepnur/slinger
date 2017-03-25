let builder = require('botbuilder')
let luisconf = require('../../config/luis.json')

// LUIS Init
let recognizer = new builder.LuisRecognizer(luisconf.url)
let intents = new builder.IntentDialog({ recognizers: [recognizer] })
let connector = new builder.ChatConnector()
let bot = new builder.UniversalBot(connector)
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
    function (session, args, next) {
        session.send('yes you ask me about schedule')
        session.endDialog()
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