import { getFolderContent } from '@controllers/dam'

export default async (req, res) => {
  const folderId = req.query.folder_id

  const userId = '123'

  const content = await getFolderContent(userId, folderId)

  res.send(content)
}
