import * as AWS from 'aws-sdk'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'sa-east-1',
  signatureVersion: 'v4'
})

export default s3
