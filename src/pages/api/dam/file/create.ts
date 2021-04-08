import db from 'db'
import { S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'
import { getFileInfo, getRootFolder } from '@services/server/files'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .post(async (req, res) => {
    let { key, name, parentId, extension, mimeType, mimeSubtype } = req.body

    const userId = req.user.id

    key = key.replace(S3_FILES_PREFIX, '')

    if (parentId === 'files') {
      const folder = await getRootFolder('root', userId)
      parentId = folder.id
    }

    const fileData = await getFileInfo(key)

    const file = await db.file.create({
      data: {
        userId,
        extension,
        mimeType,
        mimeSubtype,
        name,
        storageKey: key,
        parentId,
        size: fileData.ContentLength
      }
    })

    res.send(file)
  })

export default handler
