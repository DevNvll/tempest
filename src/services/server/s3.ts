import * as AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TEMPEST,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEMPEST,
  region: process.env.AWS_REGION_TEMPEST || 'us-east-1'
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'sa-east-1',
  signatureVersion: 'v4',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_TEMPEST,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEMPEST
  }
})

export default s3
