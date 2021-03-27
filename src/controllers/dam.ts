import humanFileSize from '@lib/human-file-size'
import s3 from '@services/s3'

import db from 'db'
import { getThumbnail } from 'services/dam'

const thumbEnabledExtensions = ['png', 'jpg', 'jpeg']

export async function getFileInfo(key: string) {
  const file = await s3
    .headObject({
      Key: 'files/' + key,
      Bucket: 'hnrk-files'
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
        userId: userId
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
        userId: userId
      }
    }
  })

  files = await Promise.all(
    files.map(async (f: any) => {
      try {
        if (
          f.mimeType === 'image' &&
          thumbEnabledExtensions.includes(f.mimeSubtype)
        ) {
          const thumbUrl = await getThumbnail(f.storageKey)
          f.thumbnailUrl = thumbUrl || null
        }
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
