'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('grades', {
            grade_id : {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
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