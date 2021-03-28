import s3 from '@services/s3'
import sharp from 'sharp'
import db from 'db'
import { NextApiRequest, NextApiResponse } from 'next'
import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'

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

    if (!file || file.userId !== userId || file.mimeType !== 'image') {
      res.status(404).send('Not Found')
      return
    }

    try {
      await s3
        .headObject({
          Key: S3_THUMBNAILS_PREFIX + '' + file.storageKey,
          Bucket: BUCKET
        })
        .promise()

      const thumb = s3
        .getObject({
          Bucket: BUCKET,
          Key: S3_THUMBNAILS_PREFIX + file.storageKey
        })
        .createReadStream()

      res.setHeader('Content-Type', 'image/png')
      thumb.pipe(res)
      return
    } catch (err) {
      const data = await s3
        .getObject({
          Bucket: BUCKET,
          Key: S3_FILES_PREFIX + file.storageKey
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
        Key: S3_THUMBNAILS_PREFIX + file.storageKey
      })

      res.setHeader('Content-Type', 'image/png')
      res.send(resizedImage)
    }
  } catch (err) {
    console.log(err)
    res.status(400).send('Bad Request')
  }
}
