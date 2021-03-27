import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import s3 from 'services/s3'
import { v4 } from 'uuid'
import { BUCKET, S3_FILES_PREFIX } from '@constants/app'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const { filename, parentId } = req.query
  const userId = '123'

  const key = `${S3_FILES_PREFIX}${userId}/${
    parentId || 'root'
  }/${v4()}.${(filename as string).split('.').pop()}`

  const url = await s3.getSignedUrl('putObject', {
    Bucket: BUCKET,
    Key: key
  })

  res.send({ key, url })
})

export default handler
