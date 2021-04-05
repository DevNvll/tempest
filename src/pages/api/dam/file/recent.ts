import db from 'db'
import { S3_FILES_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'
import { getRecentFiles, getRootFolder } from '@services/server/files'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    let { limit } = req.query

    const userId = req.user.id

    const file = await getRecentFiles(userId, parseInt(limit as string, 10))

    res.send(file)
  })

export default handler
