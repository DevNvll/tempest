import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import s3 from 'services/s3'

const handler = nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const { key } = req.query
  try {
    await s3.headObject({
      Key: 'thumbnails/' + (key as string).replace('files/', ''),
      Bucket: 'hnrk-files'
    })
    res.send({ ready: true })
  } catch (e) {
    res.status(200).send({ ready: false })
  }
})

export default handler
