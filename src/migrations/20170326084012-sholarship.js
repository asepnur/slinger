'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('scholarships', {
            scholarship_id : {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            image: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false
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
            return queryInterface.dropTable('scholarships')
    }
}