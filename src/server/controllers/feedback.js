'use strict';

const path = require('path'),
    striptags = require('striptags'),
    db = require(path.resolve('./src/server/config/sequelize')),
    _ = require('lodash')
    ;

exports.list = (req, res) => {
    let page = (req.query.page || 1) - 1;
    db.getModel('Feedback').count()
    .then(c => {
        return db.getModel('Feedback').findAll({
            order: [['createdAt', 'DESC']],
            offset: (10 * page),
            limit: 10,
            include: [{
                model: db.getModel('Upload'),
                as: 'uploads'
            }]
        })
        .then(results => {
            if (!results) {
                results = [];
            }
            let feedback = _.map(results, row => {
                return row.get({plain: true});
            });
            res.json({
                count: c,
                data: feedback
            });
        });
    })
    .catch(err => {
        console.log("Database error retrieving feedback!", err);
        res.status(500).json({message: "Error retrieving feedback!"});
    });
};

exports.view = (req, res) => {
    let id = req.params.id;
    db.getModel('Feedback').find({
        where: {
            id: id
        },
        include: [{
            model: db.getModel('Upload'),
            as: 'uploads'
        }],
        plain: true
    })
    .then(feedback => {
        if (feedback) {
            res.json(feedback);
        } else {
            res.status(400).json({message: "Feedback entry not found!"});
        }
    })
    .catch(err => {
        console.log("Database error retrieving feedback!", err);
        res.status(500).json({message: "Error retrieving feedback!"});
    });
};

exports.add = (req, res) => {
    let email = req.body.email.toLowerCase();
    db.getModel('Feedback').create({
        email: email,
        content: striptags(req.body.content)
    })
    .then(feedback => {
        if (req.body.uploads && (req.body.uploads.length > 0)) {
            return db.getModel('Upload').update({
                feedbackId: feedback.id
            }, {
                where: {
                    id: {
                        "$in": req.body.uploads
                    }
                }
            })
            .then(() => {
                return feedback;
            });
        } else {
            return feedback;
        }
    })
    .then(feedback => {
        res.json({id: feedback.id, success: true});
    })
    .catch(err => {
        console.log("Database error retrieving feedback!", err);
        res.status(500).json({message: "Error saving feedback!"});
    });
};
