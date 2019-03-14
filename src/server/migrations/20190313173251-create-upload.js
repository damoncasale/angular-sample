'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Uploads', {
            id: {
                allowNull: false,
                primaryKey: true,
                default: Sequelize.UUIDV4,
                type: Sequelize.UUID
            },
            fullsizeFilename: {
                type: Sequelize.STRING
            },
            fullsizePath: {
                type: Sequelize.UUID
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
            return queryInterface.addConstraint('Uploads', ['feedbackId'], {
                type: 'FOREIGN KEY',
                name: 'FK_Uploads_Feedbacks',
                references: {
                    table: 'Feedbacks',
                    field: 'id'
                },
                onDelete: 'cascade',
                onUpdate: 'cascade'
            })
        });
    },
    down: (queryInterface, _Sequelize) => {
        return queryInterface.removeConstraint('Uploads', 'FK_Uploads_Feedbacks')
        .then(() => {
            return queryInterface.dropTable('Uploads');
        });
    }
};
