import db from 'db'
import {
  deleteFile,
  deleteFolder,
  getFolderContent
} from '@services/server/files'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .post(async (req, res) => {
    const { folders, files } = req.body

    const foldersToDelete = folders.map((f) => {
      return deleteFolder(f, req.user.id)
    })
    const filesToDelete = files.map((f) => {
      return deleteFile(f, req.user.id)
    })
    await Promise.all([...foldersToDelete, ...filesToDelete])
    res.status(200).send({ error: false })
  })

export default handler
