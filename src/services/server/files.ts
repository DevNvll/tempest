import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import humanFileSize from '@lib/human-file-size'
import transformToTree from '@lib/transform-to-tree'
import s3 from '@services/server/s3'
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

  if (!userId) {
    throw new Error('Invalid user')
  }

  if (folderId === 'root') {
    folder = await getRootFolder('root', userId)
  } else if (folderId === 'trash') {
    folder = await getRootFolder('trash', userId)
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
        f.type = 'folder'
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
        f.type = 'file'
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

export async function getRootFolder(root: 'root' | 'trash', userId: string) {
  const name = {
    root: 'My Files',
    trash: 'Trash'
  }

  if (!userId) {
    throw new Error('Invalid user')
  }

  return db.folder.findFirst({
    where: {
      AND: {
        isRoot: true,
        name: name[root],
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

export async function generateTree(userId: string, folderId?: string) {
  let root

  if (!userId) {
    throw new Error('Invalid user')
  }

  if (!folderId) {
    root = await getRootFolder('root', userId)
  }

  const items = await db.$queryRaw(`
    WITH RECURSIVE tree AS (
      SELECT
        id,
        name,
        "parentId"
      FROM
        "Folder"
      WHERE
        id = '${root ? root.id : folderId}'
      UNION
        SELECT
          f.id,
          f.name,
          f."parentId"
        FROM
          "Folder" f
        INNER JOIN tree fs ON fs.id = f."parentId"
    ) SELECT
      *
    FROM
      tree;
  `)
  const tree = transformToTree(items)
  return tree
}
