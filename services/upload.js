const AWS = require('aws-sdk');
const { config } = require('../config/config');

const s3 = new AWS.S3();

exports.upload = (id, attachments) => {
  const objs = attachments.map((attachment, index) => ({
    ACL: 'public-read',
    Body: attachment.content,
    Bucket: config.bucket,
    Key: `${config.attachmentPrefix}${id[index]}/${attachment.filename}`,
  }));

  return Promise.all(objs.map(obj => s3.putObject(obj).promise()));
};
