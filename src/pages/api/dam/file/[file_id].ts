import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import db from 'db'
import s3 from 'services/s3'

import { getFileInfo } from '@controllers/dam'
import humanFileSize from '@lib/human-file-size'
import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import cleanObject from '@lib/cleanObject'
import pick from 'lodash/pick'

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
          Key: S3_FILES_PREFIX + file.storageKey,
          Bucket: BUCKET
        })
        .promise(),
      s3
        .deleteObject({
          Key: S3_THUMBNAILS_PREFIX + file.storageKey,
          Bucket: BUCKET
        })
        .promise()
    ])
    await await res.send({ success: true })
  })
  .patch(async (req, res) => {
    const { name } = req.body

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

    const editableFields = ['name', 'parentId']

    const patchPayload = cleanObject(
      pick(
        {
          name
        },
        editableFields
      )
    )

    await db.file.update({
      where: {
        id: fileId
      },
      data: patchPayload
    })
  })

export default handler
