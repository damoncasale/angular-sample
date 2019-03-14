'use strict';

module.exports = function (sequelize, DataTypes) {
    const Upload = sequelize.define('Upload', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        fullsizeFilename: DataTypes.STRING,
        fullsizePath: DataTypes.STRING
    },{
        indexes: []
    });

    Upload.associate = function(/*models*/) {
        // associations can be defined here
        //Upload.belongsTo(models.Feedback, {as: 'feedbackId', allowNull: true});
    };

    return Upload;
};
