import db from 'db'
import s3 from '@services/server/s3'

import { deleteFile, getFileInfo } from '@services/server/files'
import humanFileSize from '@lib/human-file-size'
import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import cleanObject from '@lib/cleanObject'
import pick from 'lodash/pick'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    try {
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

      const signedUrl = await s3.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: S3_FILES_PREFIX + file.storageKey,
        ResponseContentDisposition: 'attachment;filename=' + file.name
      })

      res.send({
        ...file,
        readableSize: humanFileSize(fileInfo.ContentLength),
        size: fileInfo.ContentLength,
        signedUrl
      })
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  })
  .delete(async (req, res) => {
    const fileId = req.query.file_id as string

    const userId = req.user.id

    await deleteFile(fileId, userId)

    res.send({ success: true })
  })
  .patch(async (req, res) => {
    const { name } = req.body

    const fileId = req.query.file_id as string

    const userId = req.user.id

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
