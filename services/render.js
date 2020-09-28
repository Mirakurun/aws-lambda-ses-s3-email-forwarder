const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();
const fs = require('fs');
const path = require('path');
const mjml2html = require('mjml');
const filesize = require('filesize');
const { config } = require('../config/config');

exports.render = (id, attachments) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../template/attachments.mjml');
    fs.readFile(filepath, 'utf8', (err, data) => {
      const app = new Vue({
        data: {
          attachments,
          file: {
            archive: ['7z', 'gz', 'rar', 'tar', 'zip'],
            audio: ['aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'],
            code: [
              'cs',
              'css',
              'htm',
              'html',
              'java',
              'js',
              'json',
              'php',
              'py',
              'swift',
              'ts',
              'xhtml',
              'xml',
              'yaml',
              'yml',
            ],
            csv: ['csv'],
            excel: ['xls', 'xlsx'],
            image: [
              'ai',
              'bmp',
              'gif',
              'ico',
              'jpeg',
              'jpg',
              'png',
              'psd',
              'svg',
              'tif',
              'tiff',
              'webp',
            ],
            pdf: ['pdf'],
            powerpoint: ['ppt', 'pptx'],
            text: ['log', 'txt'],
            video: [
              'avi',
              'mkv',
              'mp2',
              'mp4',
              'mpe',
              'mpg',
              'mpeg',
              'mpv',
              'ogv',
              'vob',
              'webm',
              'wmv',
            ],
            word: ['doc', 'docx'],
          },
        },
        methods: {
          fixedEncodeURIComponent(str) {
            return encodeURIComponent(str).replace(/[!'()]/g, escape);
          },
          getFileExt(filename) {
            const ext = filename.split('.');
            return ext[ext.length - 1];
          },
          getFilesize(size) {
            return filesize(size);
          },
          getFileURL(index, filename) {
            if (config.cloudFront) {
              return `https://${config.cloudFront}/${config.attachmentPrefix}${
                id[index]
              }/${this.fixedEncodeURIComponent(filename)}`;
            }
            return `https://${config.bucket}.s3.${
              config.region
            }.amazonaws.com/${
              config.attachmentPrefix
            }${this.fixedEncodeURIComponent(filename)}`; // Path-Style Access, see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingBucket.html
          },
          isMatchExt(arr, filename) {
            return arr.includes(this.getFileExt(filename));
          },
        },
        template: data,
      });

      renderer
        .renderToString(app)
        .then(string => {
          const htmlOutput = mjml2html(string);
          resolve(htmlOutput.html);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};
