import { deleteFolder, getFolderContent } from '@controllers/dam'
import cleanObject from '@lib/cleanObject'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import db from 'db'
import pick from 'lodash/pick'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get(async (req, res) => {
    const folderId = req.query.folder_id as string

    const userId = '123'

    const content = await getFolderContent(userId, folderId)

    res.send(content)
  })
  .patch(async (req, res) => {
    const { name } = req.body

    const folderId = req.query.folder_id as string

    const userId = '123'

    const folder = await db.folder.findFirst({
      where: {
        id: folderId
      },
      select: {
        userId: true
      }
    })
    if (folder.userId !== userId) {
      res.status(404).send({
        success: false
      })
      return
    }

    const editableFields = ['name', 'parentId']

    const patchPayload = cleanObject(
      pick(
        {
          name
        },
        editableFields
      )
    )

    await db.folder.update({
      where: {
        id: folderId
      },
      data: patchPayload
    })
  })
  .delete(async (req, res) => {
    const folderId = req.query.folder_id as string
    const content = await deleteFolder(folderId)

    res.send(content)
  })

export default handler
