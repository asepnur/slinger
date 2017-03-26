'use strict'
module.exports = (sequelize, DataTypes) => {
    let scholarship = sequelize.define('scholarship', {
        scholarship_id : {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: DataTypes.STRING(50),
        description: DataTypes.TEXT,
        image : DataTypes.STRING(100),
        end_date : DataTypes.DATE
    })
    console.log(scholarship)
    return scholarship
}