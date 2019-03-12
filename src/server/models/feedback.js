'use strict';

module.exports = function (sequelize, DataTypes) {
    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: DataTypes.STRING,
        content: DataTypes.STRING
    },{
        indexes: [{
            fields: ["email"],
            primary: false,
            unique: false
        }]
    });

    Feedback.associate = function(/*models*/) {
        // associations can be defined here
        Feedback.hasMany(models.Upload, {as: 'uploads', foreignKey: {name: 'feedbackId'}});
    };

    return Feedback;
};
