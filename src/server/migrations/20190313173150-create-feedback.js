'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Feedbacks', {
            id: {
                allowNull: false,
                primaryKey: true,
                default: Sequelize.UUIDV4,
                type: Sequelize.UUID
            },
            email: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING
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
        .then(() => {
            return queryInterface.addIndex('Feedbacks', ['email']);
        });
    },
    down: (queryInterface, _Sequelize) => {
        return queryInterface.dropTable('Feedbacks');
    }
};
