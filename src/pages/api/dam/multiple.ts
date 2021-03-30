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
  .patch(async (req, res) => {
    const { folders = [], files = [], newParentId } = req.body
    const userId = req.user.id
    const foldersToMove = folders.map(async (f) => {
      const folder = await db.folder.findFirst({
        where: {
          AND: {
            id: f,
            userId
          }
        }
      })

      if (folder.userId !== userId) {
        res.status(401).send('Forbidden')
        throw new Error('Forbidden')
      }

      return db.folder.update({
        where: {
          id: f
        },
        data: {
          parentId: newParentId
        }
      })
    })
    const filesToMove = files.map(async (f) => {
      const file = await db.file.findFirst({
        where: {
          AND: {
            id: f,
            userId
          }
        }
      })

      if (file.userId !== userId) {
        res.status(401).send('Forbidden')
        throw new Error('Forbidden')
      }

      return db.file.update({
        where: {
          id: f
        },
        data: {
          parentId: newParentId
        }
      })
    })
    await Promise.all([...foldersToMove, ...filesToMove])
    res.status(200).send({ error: false })
  })
  .delete(async (req, res) => {
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
