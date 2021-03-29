import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'

import nc from 'next-connect'
import s3 from '@services/server/s3'
import humanFileSize from '@lib/human-file-size'
import { BUCKET, S3_FILES_PREFIX } from '@constants/app'

const handler = nc().get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = '123'

  const folderId = req.query.folder_id as string

  const folder = await db.folder.findUnique({
    where: {
      id: folderId || '1234'
    }
  })

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

  res.send({ files, size: humanFileSize(totalSize) })
})

export default handler
