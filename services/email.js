const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01',
  }),
  sendingRate: config.sendingRate,
});

exports.email = message => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
      }

      console.log(
        `Forwarded email from: '${info.envelope.from}' to: '${info.envelope.to}'.`
      );

      resolve('Email forwarded.');
    });
  });
};
