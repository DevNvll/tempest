import s3 from '@services/server/s3'
import sharp from 'sharp'
import db from 'db'
import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import { authenticated } from '@lib/auth/authenticatedMiddleware'
import nc from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { EnhancedRequestWithAuth } from '@typings/api'

const handler = nc<EnhancedRequestWithAuth, NextApiResponse>()
  .use(authenticated)
  .get(async (req, res) => {
    const id = req.query.file_id as string

    const userId = req.user.id
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

        const thumb = s3.getSignedUrl('getObject', {
          Bucket: BUCKET,
          Key: S3_THUMBNAILS_PREFIX + file.storageKey,
          Expires: 604800
        })

        res.setHeader('location', thumb)
        res.setHeader(
          'Cache-Control',
          's-maxage=302400, stale-while-revalidate'
        )
        res.status(302).send('')
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

        await s3
          .putObject({
            Body: resizedImage,
            Bucket: BUCKET,
            ContentType: 'image/png',
            Key: S3_THUMBNAILS_PREFIX + file.storageKey
          })
          .promise()

        res.setHeader('Content-Type', 'image/png')
        res.send(resizedImage)
      }
    } catch (err) {
      console.log(err)
      res.status(400).send('Bad Request')
    }
  })

export default handler
