import s3 from '@services/s3'
import sharp from 'sharp'
import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'

const BUCKET = process.env.AWS_BUCKET

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.file_id as string

  const userId = '123'
  try {
    const file = await db.file.findUnique({
      where: {
        id
      }
    })

    if (!file || file.userId !== userId) {
      res.status(404).send('Not Found')
      return
    }
    try {
      await s3
        .headObject({
          Key: process.env.THUMBNAILS_BUCKET_PREFIX + '' + file.storageKey,
          Bucket: BUCKET
        })
        .promise()

      const thumb = s3
        .getObject({
          Bucket: BUCKET,
          Key: process.env.THUMBNAILS_BUCKET_PREFIX + file.storageKey
        })
        .createReadStream()

      res.setHeader('Content-Type', 'image/png')
      thumb.pipe(res)
      return
    } catch (err) {
      const data = await s3
        .getObject({
          Bucket: BUCKET,
          Key: process.env.FILES_BUCKET_PREFIX + file.storageKey
        })
        .promise()

      const resizedImage = await sharp(data.Body)
        .resize(300, 300)
        .toFormat('png')
        .toBuffer()

      await s3.putObject({
        Body: resizedImage,
        Bucket: BUCKET,
        ContentType: 'image/png',
        Key: process.env.THUMBNAILS_BUCKET_PREFIX + file.storageKey
      })

      res.setHeader('Content-Type', 'image/png')
      res.send(resizedImage)
    }
  } catch (err) {
    console.log(err)
    res.status(400).send('Bad Request')
  }
}
