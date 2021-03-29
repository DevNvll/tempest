import s3 from '@services/server/s3'
import humanFileSize from '@lib/human-file-size'
import { BUCKET, S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'

import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const MAX_SIZE = 16106127360

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const userId = req.user.id

    let totalSize = 0,
      files = 0,
      ContinuationToken

    do {
      var resp = await s3
        .listObjectsV2({
          Bucket: BUCKET,
          Prefix: `${S3_FILES_PREFIX}${userId}`,
          ContinuationToken
        })
        .promise()
      resp.Contents.forEach((o) => {
        totalSize += o.Size
        files += 1
      })
      ContinuationToken = resp.NextContinuationToken
    } while (ContinuationToken)

    res.send({
      totalFiles: files,
      sizeReadable: humanFileSize(totalSize),
      maxReadable: humanFileSize(MAX_SIZE),
      size: totalSize,
      max: MAX_SIZE
    })
  })

export default handler
