'use strict'
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('user', {
        email: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING(50)
        },
        password: {
            type: DataTypes.STRING(32)
        }
    },
    {
        classMethods: {
            associate: (models) => {
            // associations can be defined here
            }
        }
    })
  return user
}