const AWS = require('aws-sdk');
const { simpleParser } = require('mailparser');
const nanoid = require('nanoid');
const { config } = require('./config/config');
const { render } = require('./services/render');
const { upload } = require('./services/upload');
const { email } = require('./services/email');

const s3 = new AWS.S3();

module.exports.forwarder = async event => {
  // Parse event
  console.log('Parsing incoming email event...');
  const { messageId } = event.Records[0].ses.mail;
  const { date, from, subject, to } = event.Records[0].ses.mail.commonHeaders;

  console.log(`Date: ${date}`);
  console.log(`From: ${from}`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);

  // Fetch email
  console.log(
    `Fetching email at s3://${config.bucket}/${config.keyPrefix}${messageId}`
  );

  try {
    const data = await s3
      .getObject({
        Bucket: config.bucket,
        Key: `${config.keyPrefix}${messageId}`,
      })
      .promise();

    console.log('Parsing email...');
    const parsed = await simpleParser(data.Body);

    const { name, address } = parsed.from.value[0];
    const { html } = parsed;
    const sender = name || address;

    const message = {
      from: `${sender} <${config.from}>`,
      replyTo: parsed.from.text.split(',')[0],
      to: config.forwardTo,
      subject,
      text: parsed.text,
    };

    if (parsed.html) {
      message.html = html;
    }

    if (Array.isArray(parsed.attachments) && parsed.attachments.length) {
      const id = [];

      parsed.attachments.forEach(() => {
        id.push(nanoid());
      });

      console.log('Uploading attachments...');
      const files = await upload(id, parsed.attachments);

      console.log('Upload done.');
      console.log(files);

      const htmlOutput = await render(id, parsed.attachments);
      message.html += htmlOutput;
    }

    const response = await email(message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: response, event }),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};
