let express = require('express'),
    session = require('express-session'),
    routes = require('./src/routes'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    sconf = require('./config/session.json'),
    env = require('./src/utils/env').get(),
    app = express()

// some environment variables
let port = process.env.PORT || 8888

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session(sconf[env]))
app.use('/', routes)

// create http server
const server = app.listen(port, () => {
    console.log('slinger listening on %d', server.address().port)
    console.log('web service started')
})