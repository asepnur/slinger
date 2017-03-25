'use strict'
module.exports = (sequelize, DataTypes) => {
    let course = sequelize.define('course', {
        course_id : {
          type: DataTypes.INTEGER,
           primaryKey: true
        },
        name: DataTypes.STRING,
        lecturer: DataTypes.STRING,
        room : DataTypes.STRING,
        date : DataTypes.INTEGER(1)
    }, {
        classMethods: {
            associate: (models) => {
                course.belongsToMany(models.user, { as: 'students', through: 'user_course', foreignKey: 'user_id' })
            }
        }
    })
    return course
}