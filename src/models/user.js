'use strict'
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('user', {
        user_id : {
           type: DataTypes.INTEGER,
           primaryKey: true
        },
        email: DataTypes.STRING(50),
        password: DataTypes.STRING(32),
        image: DataTypes.STRING(100)
    },
    {
        classMethods: {
            associate: (models) => {
                user.belongsToMany(models.course, { as: 'courses', through: 'user_course', foreignKey: 'course_id' })
            }
        }
    })
  return user
}