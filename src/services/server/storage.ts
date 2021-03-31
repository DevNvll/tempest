import { BUCKET, S3_FILES_PREFIX } from '@constants/app'
import humanFileSize from '@lib/human-file-size'
import s3 from './s3'

const MAX_SIZE = 16106127360

export async function getUserStorage(userId: string) {
  let totalSize = 0,
    files = 0,
    ContinuationToken

  do {
    let resp = await s3
      .listObjectsV2({
        Bucket: BUCKET,
        Prefix: `${S3_FILES_PREFIX}${userId}`,
        ContinuationToken
      })
      .promise()
    resp.Contents.forEach((o) => {
      totalSize += o.Size
      files += 1
    })
    ContinuationToken = resp.NextContinuationToken
  } while (ContinuationToken)

  return {
    totalFiles: files,
    sizeReadable: humanFileSize(totalSize),
    maxReadable: humanFileSize(MAX_SIZE),
    size: totalSize,
    max: MAX_SIZE
  }
}
