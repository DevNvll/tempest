import db from 'db'
import { getFolderContent, getRootFolder } from '@services/server/files'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const userId = req.user.id

    const content = await getFolderContent(userId)

    res.send(content)
  })
  .post(async (req, res) => {
    let { parentId, name } = req.body
    const userId = req.user.id

    if (parentId === 'files') {
      const folder = await getRootFolder('root', userId)
      parentId = folder.id
    }

    try {
      const folder = await db.folder.create({
        data: {
          name,
          parentId,
          userId
        }
      })
      res.send({ ...folder, type: 'folder' })
    } catch (err) {
      res.status(400).send({ error: true })
    }
  })

export default handler
