'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('courses', {
            course_id : {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lecturer: {
                type: Sequelize.STRING,
                allowNull: false
            },
            room : {
                type: Sequelize.STRING,
                allowNull: false
            },
            date : {
                type: Sequelize.INTEGER(1),
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('courses')
    }
}