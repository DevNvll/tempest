import AWS from 'aws-sdk'

AWS.config.update({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TEMPEST,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEMPEST,
  region: process.env.AWS_REGION_TEMPEST || 'sa-east-1',
  signatureVersion: 'v4'
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
})

export default s3
