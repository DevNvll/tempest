import s3 from '@services/server/s3'
import humanFileSize from '@lib/human-file-size'
import { BUCKET, S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'

import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'
import { getUserStorage } from '@services/server/storage'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const userId = req.user.id

    const storage = await getUserStorage(userId)

    res.send(storage)
  })

export default handler
