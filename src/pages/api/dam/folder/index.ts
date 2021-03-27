import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'

import nc from 'next-connect'
import { getFolderContent } from '@controllers/dam'

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = '123'

    const content = await getFolderContent(userId)

    res.send(content)
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { parentId, name } = req.body
    const userId = '123'

    try {
      const folder = await db.folder.create({
        data: {
          name,
          parentId,
          userId
        }
      })
      res.send(folder)
    } catch (err) {
      res.status(400).send({ error: true })
    }
  })

export default handler
