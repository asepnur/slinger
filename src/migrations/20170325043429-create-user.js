'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            email: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING(50)
            },
            password: {
                type: Sequelize.STRING(32)
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
            return queryInterface.dropTable('users')
    }
}