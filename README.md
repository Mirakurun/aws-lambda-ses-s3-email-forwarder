# AWS Lambda SES S3 Email Forwarder

> WIP

A Node.js Lambda function that utilizes Amazon SES to forward incoming emails to an email address inbox. Setup Amazon SES to receive emails and deliver to a S3 bucket, then invoke lambda to forward the email to your email of choice.

## Features

* Serverless... no servers required because of Lambda.
* Cheap... can cost as low as a few cents.
* Parse email attachments.  Saves attachments to S3 and insert download links into email. Avoid SES email size limitations.
  * Receiving email: 30 MB
  * Sending email: 10 MB
