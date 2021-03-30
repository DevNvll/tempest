import db from 'db'
import { generateTree, getFolderContent } from '@services/server/files'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'
import _ from 'lodash'
import transformToTree from '@lib/transform-to-tree'
import { getRootFolder } from '@services/client/dam'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const userId = req.user.id

    const tree = await generateTree(userId)

    await res.send(tree)
  })

export default handler
