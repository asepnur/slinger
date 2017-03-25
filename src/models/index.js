'use strict'
let fs        = require('fs'),
    path      = require('path'),
    Sequelize = require('sequelize'),
    basename  = path.basename(module.filename),
    env       = require('../utils/env').get(),
    config    = require('../../config/config.json')[env],
    db        = {}

// sync all model path
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    let model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// load config
if (config.use_env_variable) {
  db.sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  db.sequelize = new Sequelize(config.database, config.username, config.password, config)
}
db.Sequelize = Sequelize

module.exports = db
