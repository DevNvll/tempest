import AWS from 'aws-sdk'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

AWS.config.update({
  accessKeyId: serverRuntimeConfig.AWS_ACCESS_KEY_ID_TEMPEST,
  secretAccessKey: serverRuntimeConfig.AWS_SECRET_ACCESS_KEY_TEMPEST,
  region: process.env.AWS_REGION_TEMPEST || 'us-east-1'
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'sa-east-1',
  signatureVersion: 'v4'
})

export default s3
