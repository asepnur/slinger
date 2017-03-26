'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user_course', {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            course_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'courses',
                    key: 'course_id'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            }
        }, {
            uniqueKeys: {
                actions_unique: {
                    fields: ['user_id', 'course_id']
                }
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_course')
    }
}