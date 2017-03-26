'use strict'
module.exports = (sequelize, DataTypes) => {
    let schedule = sequelize.define('schedule', {
        course_id : {
          type: DataTypes.INTEGER,
           primaryKey: true
        },
        name: DataTypes.STRING,
        lecturer: DataTypes.STRING,
        room : DataTypes.STRING,
        date : DataTypes.INTEGER(1)
    })
    return schedule
}