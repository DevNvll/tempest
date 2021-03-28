import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import humanFileSize from '@lib/human-file-size'
import s3 from '@services/s3'
import db from 'db'

export async function getFileInfo(key: string) {
  const file = await s3
    .headObject({
      Key: S3_FILES_PREFIX + key,
      Bucket: BUCKET
    })
    .promise()
  return file
}

export async function getFolderContent(
  userId: string,
  folderId: string = 'root'
) {
  let folder
  if (folderId === 'root') {
    folder = await db.folder.findFirst({
      where: {
        AND: {
          name: 'My Files',
          isRoot: true,
          userId
        }
      },
      include: {
        parent: true
      }
    })
  } else if (folderId === 'trash') {
    folder = await db.folder.findFirst({
      where: {
        AND: {
          name: 'Trash',
          isRoot: true,
          userId
        }
      },
      include: {
        parent: true
      }
    })
  } else {
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
        parentId: folder.id,
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
        parentId: folder.id,
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
    ...(!folder.isRoot ? { ...folder } : { ...folder, root: true }),
    folders,
    files
  }
  return content
}

async function getRootFolder(id: 'root' | 'trash', userId: string) {
  const name = {
    root: 'My Files',
    trash: 'Trash'
  }
  return db.folder.findFirst({
    where: {
      AND: {
        isRoot: true,
        name: name[id],
        userId
      }
    }
  })
}

export async function deleteFolder(folderId: string, userId: string) {
  const trash = await getRootFolder('trash', userId)

  const folder = await db.folder.findUnique({
    where: {
      id: folderId
    }
  })

  if (!folder || folder.userId !== userId) {
    throw new Error('Unable to delete folder')
  }

  if (folder.parentId !== trash.id) {
    await db.folder.update({
      where: {
        id: folderId
      },
      data: {
        parentId: trash.id
      }
    })

    return folder
  } else {
    await db.folder.update({
      where: {
        id: folderId
      },
      data: {
        isDeleted: true
      }
    })

    return folder
  }
}

export async function deleteFile(fileId: string, userId: string) {
  const trash = await getRootFolder('trash', userId)

  const file = await db.file.findUnique({
    where: {
      id: fileId
    }
  })

  if (!file || file.userId !== userId) {
    throw new Error('Unable to delete file')
  }

  if (file.parentId !== trash.id) {
    await db.file.update({
      where: {
        id: fileId
      },
      data: {
        parentId: trash.id
      }
    })

    return file
  } else {
    await db.file.update({
      where: {
        id: fileId
      },
      data: {
        isDeleted: true
      }
    })

    return file
  }
}
