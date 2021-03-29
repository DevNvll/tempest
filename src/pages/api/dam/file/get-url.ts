import s3 from '@services/server/s3'
import { v4 } from 'uuid'
import { BUCKET, S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const { filename, parentId } = req.query
    const userId = req.user.id

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
