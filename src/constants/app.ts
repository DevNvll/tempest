export const BUCKET = process.env.AWS_BUCKET_TEMPEST
export const S3_FILES_PREFIX = process.env.FILES_BUCKET_PREFIX || 'files/'
export const S3_THUMBNAILS_PREFIX =
  process.env.THUMBNAILS_BUCKET_PREFIX || 'thumbnails/'
