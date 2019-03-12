'use strict';

const path = require('path'),
    formidable = require('formidable'),
    randomstring = require('randomstring'),
    base64 = require('file-base64'),
    moment = require('moment'),
    Promise = require('bluebird'),
    async = require('async'),
    fs = require('fs'),
    db = require(path.resolve('./src/server/config/sequelize')),
    _ = require('lodash')
    ;

exports.delete = (req, res) => {
    db.getModel('Upload').find({
        where: {
            id: req.params.id
        }
    })
    .then(upload => {
        if (upload && !upload.feedbackId) {
            return db.getModel('Upload').destroy({
                where: {
                    id: req.params.id,
                    feedbackId: {
                        "$ne": null
                    }
                }
            });
        } else {
            return null;
        }
    })
    .then(() => {
        res.json({success: true});
    })
    .catch(err => {
        console.log("Database error deleting uploaded file!", err);
        res.status(500).json({message: "Error deleting uploaded file!"});
    });
};

exports.upload = (req, res) => {
    let form = new formidable.IncomingForm({
        maxFieldsSize: 1024 * 1024 * 1 // 1 megabyte image size limit
    });
    let uploads = [];
    let files = [];

    // Don't process the files until we've scanned all of them.
    form.on('file', (_fileField, file) => {
        files.push(file);
    });

    // Do all of the form processing here, so we don't trip over ourselves
    // due to async issues.
    form.on('end', () => {
        let series = [];
        files.forEach(file => {
            series.push(c => {
                const extPos = file.name.lastIndexOf(".");
                const ext = file.name.substr(extPos).toLowerCase();
                let newPath, folder, newFile;

                if (-1 !== ['.gif', '.jpg', '.jpeg', '.png'].indexOf(ext)) {

                    // To prevent uploading too many image files into the same folder,
                    // break them into multiple folders inside of the upload folder,
                    // with two-letter abbreviations.
                    new Promise((resolve, reject) => {
                        base64.encode(file.path, (err, b64String) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(b64String);
                            }
                        });
                    })
                    .then(b64String => {
                        folder = b64String.substr(0, 2);
                        let folderPath = path.join(__dirname, '/uploads/', folder);
                        return new Promise((resolve, reject) => {
                            fs.access(folderPath, fs.constants.F_OK, err => {
                                if (!err) {
                                    fs.mkdir(folderPath, {}, err => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(null);
                                        }
                                    });
                                } else {
                                    resolve(null);
                                }
                            });
                        })
                    })
                    .then(() => {
                        newFile = moment().format('YYYYMMDDHHmmss') + '_' + randomstring.generate(5) + '_', file.name;
                        newPath = path.join(__dirname, '/uploads/', folder, newFile);

                        return new Promise((resolve, reject) => {
                            // Store the original, uploaded file.  We could do image
                            // resizing/compresion here if desired.
                            fs.rename(file.path, newPath, err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(null);
                                }
                            });
                        });
                    })
                    .then(() => {
                        return db.getModel('Upload').create({
                            fullsizeFilename: newFile,
                            fullsizePath: newPath
                        })
                        .then(upload => {
                            let data = upload.get({plain: true});
                            data.originalFilename = file.name;
                            uploads.push(data);
                            c(null);
                        });
                    })
                    .catch(err => {
                        console.log("Error uploading file", err);
                        // Don't error out during this bulk upload!
                        c(null);
                    });
                } else {
                    c(null);
                }
            });
        });

        async.series(series, () => {
            if (0 === uploads.length) {
                return res.status(400).send('No files were uploaded.');
            } else {
                // Handle any files which didn't upload properly
                // on the client side.
                return res.status(201).json({
                    uploads: uploads
                });
            }
        });
    });

    form.parse(req);
};
