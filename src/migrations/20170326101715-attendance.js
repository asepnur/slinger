'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('attendances', {
            attendance_id : {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            course_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'course_id'
                },
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },
    down: (queryInterface, Sequelize) => {
            return queryInterface.dropTable('users')
    }
}