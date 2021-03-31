import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'sa-east-1',
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TEMPEST,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEMPEST
})

export default s3
