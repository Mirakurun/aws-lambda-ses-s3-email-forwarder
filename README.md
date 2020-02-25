# AWS Lambda SES S3 Email Forwarder

> WIP

A Node.js Lambda function that utilizes Amazon SES to forward incoming emails from SES delivered to a S3 bucket to an email address.

## Features

* Serverless... no servers required because of Lambda.
* Cheap... can cost as low as a few cents.
* Parse email attachments.  Saves attachments to S3 and insert download links into email. Avoid SES email size limitations.
  * Receiving email: 30 MB
  * Sending email: 10 MB
