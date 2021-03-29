import db from 'db'
import { S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .post(async (req, res) => {
    let { key, name, parentId, extension, mimeType, mimeSubtype } = req.body

    const userId = req.user.id

    key = key.replace(S3_FILES_PREFIX, '')

    const file = await db.file.create({
      data: {
        userId,
        extension,
        mimeType,
        mimeSubtype,
        name,
        storageKey: key,
        parentId
      }
    })

    res.send(file)
  })

export default handler
