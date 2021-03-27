import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import s3 from 'services/s3'
import { v4 } from 'uuid'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const { filename, parentId } = req.query
  const userId = '123'

  const key = `files/${userId}/${
    parentId || 'root'
  }/${v4()}.${(filename as string).split('.').pop()}`

  const url = await s3.getSignedUrl('putObject', {
    Bucket: 'hnrk-files',
    Key: key
  })

  res.send({ key, url })
})

export default handler
