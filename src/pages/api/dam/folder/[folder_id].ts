import { deleteFolder, getFolderContent } from '@controllers/dam'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const folderId = req.query.folder_id as string

    const userId = '123'

    const content = await getFolderContent(userId, folderId)

    res.send(content)
  })
  .delete(async (req, res) => {
    const folderId = req.query.folder_id as string
    const content = await deleteFolder(folderId)

    res.send(content)
  })

export default handler
