import db from 'db'
import { S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'
import { getRootFolder } from '@services/server/files'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .post(async (req, res) => {
    let { itemId, type } = req.body

    const userId = req.user.id

    if (type === 'folder') {
      const folder = await db.folder.findUnique({
        where: {
          id: itemId
        }
      })

      if (!folder || folder.userId !== userId) {
        res.status(401).send('Forbidden')
        throw new Error('Fobidden')
      }

      const share = await db.shared.create({
        data: {
          folder: {
            connect: {
              id: itemId
            }
          },
          type: 'Folder',
          userId
        }
      })

      res.send(share)
    } else {
      const file = await db.file.findUnique({
        where: {
          id: itemId
        }
      })

      if (!file || file.userId !== userId) {
        res.status(401).send('Forbidden')
        throw new Error('Fobidden')
      }

      const share = await db.shared.create({
        data: {
          file: {
            connect: {
              id: itemId
            }
          },
          type: 'File',
          userId
        }
      })

      res.send(share)
    }
  })

export default handler
