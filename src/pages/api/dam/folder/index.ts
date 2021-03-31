import db from 'db'
import {
  createFolder,
  getFolderContent,
  getRootFolder
} from '@services/server/files'
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

    if (parentId === 'files' || parentId === 'root') {
      const folder = await getRootFolder('root', userId)
      parentId = folder.id
    }

    try {
      const folder = await createFolder({
        name,
        parentId,
        userId
      })

      res.send(folder)
    } catch (err) {
      res.status(400).send({ error: true })
    }
  })

export default handler
