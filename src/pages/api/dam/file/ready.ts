import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import s3 from '@services/server/s3'
import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const { key } = req.query
  try {
    await s3.headObject({
      Key: S3_THUMBNAILS_PREFIX + (key as string).replace(S3_FILES_PREFIX, ''),
      Bucket: BUCKET
    })
    res.send({ ready: true })
  } catch (e) {
    res.status(200).send({ ready: false })
  }
})

export default handler
