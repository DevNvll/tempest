import { BUCKET, S3_FILES_PREFIX } from '@constants/app'
import humanFileSize from '@lib/human-file-size'
import s3 from '@services/s3'

import db from 'db'

const thumbEnabledExtensions = ['png', 'jpg', 'jpeg']

export async function getFileInfo(key: string) {
  const file = await s3
    .headObject({
      Key: S3_FILES_PREFIX + key,
      Bucket: BUCKET
    })
    .promise()
  return file
}

export async function getFolderContent(userId: string, folderId?: string) {
  let folder
  if (folderId) {
    folder = await db.folder.findUnique({
      where: {
        id: folderId
      },
      include: {
        parent: true
      }
    })
  }

  let folders = await db.folder.findMany({
    where: {
      AND: {
        ...(folderId
          ? { parentId: folderId || undefined }
          : {
              NOT: {
                parent: {
                  id: {
                    contains: ''
                  }
                }
              }
            }),
        userId: userId,
        isDeleted: false
      }
    }
  })

  folders = await Promise.all(
    folders.map(async (f: any) => {
      try {
        const subFolders = await db.folder.findMany({
          where: {
            parent: {
              id: f.id
            }
          }
        })
        const files = await db.file.findMany({
          where: {
            parent: {
              id: f.id
            }
          }
        })

        f.numberOfItems = [...subFolders, ...files].length
      } catch (err) {
      } finally {
        return f
      }
    })
  )

  let files = await db.file.findMany({
    where: {
      AND: {
        ...(folderId
          ? { parentId: folderId || undefined }
          : {
              NOT: {
                parent: {
                  id: {
                    contains: ''
                  }
                }
              }
            }),
        userId: userId,
        isDeleted: false
      }
    }
  })

  files = await Promise.all(
    files.map(async (f: any) => {
      try {
        const fileInfo = await getFileInfo(f.storageKey)
        f.size = humanFileSize(fileInfo.ContentLength)
      } catch (err) {
      } finally {
        return f
      }
    })
  )

  const content = {
    ...(folder ? { ...folder } : { name: 'Files', root: true }),
    folders,
    files
  }
  return content
}

export async function deleteFolder(folderId: string) {
  const folder = await db.folder.update({
    where: {
      id: folderId
    },
    data: {
      isDeleted: true
    }
  })
  return folder
}
