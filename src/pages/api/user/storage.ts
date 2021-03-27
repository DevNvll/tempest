import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'

import nc from 'next-connect'
import s3 from '@services/s3'
import humanFileSize from '@lib/human-file-size'

const MAX_SIZE = 16106127360

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
        Bucket: 'hnrk-files',
        Prefix: `files/${userId}`,
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
