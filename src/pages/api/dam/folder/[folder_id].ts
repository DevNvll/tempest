import {
  deleteFolder,
  getFolderContent,
  updateFolder
} from '@services/server/files'
import cleanObject from '@lib/cleanObject'
import db from 'db'
import pick from 'lodash/pick'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    try {
      const folderId = req.query.folder_id as string

      const content = await getFolderContent(req.user.id, folderId)

      res.send(content)
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
    }
  })
  .patch(async (req, res) => {
    const { name } = req.body
    const userId = req.user.id
    const folderId = req.query.folder_id as string

    const folder = await updateFolder(folderId, {
      userId,
      name
    })

    res.send(folder)
  })
  .delete(async (req, res) => {
    const folderId = req.query.folder_id as string
    const userId = req.user.id
    const content = await deleteFolder(folderId, userId)

    res.send(content)
  })

export default handler
