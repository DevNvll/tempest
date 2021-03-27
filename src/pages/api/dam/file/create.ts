import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'

import db from 'db'
import { S3_FILES_PREFIX } from '@constants/app'

const handler = nc<NextApiRequest, NextApiResponse>().post(async (req, res) => {
  let { key, name, parentId, extension, mimeType, mimeSubtype } = req.body

  const userId = '123'

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
