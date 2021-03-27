import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import db from 'db'
import s3 from 'services/s3'
import { getThumbnail } from 'services/dam'
import { getFileInfo } from '@controllers/dam'
import humanFileSize from '@lib/human-file-size'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const fileId = req.query.file_id as string
    const file = await db.file.findUnique({
      where: {
        id: fileId
      },
      include: {
        parent: true
      }
    })

    const fileInfo = await getFileInfo(file.storageKey)

    res.send({
      ...file,
      readableSize: humanFileSize(fileInfo.ContentLength),
      size: fileInfo.ContentLength
    })
  })
  .post(async (req, res) => {
    const { key, name, parentId } = req.body

    const userId = '123'

    const file = await s3
      .headObject({
        Key: 'files/' + key,
        Bucket: 'hnrk-files'
      })
      .promise()

    const thumb = await getThumbnail(key)

    res.send(thumb)
  })
  .delete(async (req, res) => {
    const fileId = req.query.file_id as string

    const userId = '123'

    const file = await db.file.findFirst({
      where: {
        id: fileId
      },
      select: {
        storageKey: true,
        userId: true
      }
    })

    if (file.userId !== userId) {
      res.status(404).send({
        success: false
      })
      return
    }

    await Promise.all([
      db.file.delete({
        where: {
          id: fileId
        }
      }),
      s3
        .deleteObject({
          Key: 'files/' + file.storageKey,
          Bucket: 'hnrk-files'
        })
        .promise(),
      s3
        .deleteObject({
          Key: 'thumbnails/' + file.storageKey,
          Bucket: 'hnrk-files'
        })
        .promise()
    ])
    await await res.send({ success: true })
  })

export default handler
