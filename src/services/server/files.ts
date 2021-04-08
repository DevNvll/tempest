import { BUCKET, S3_FILES_PREFIX, S3_THUMBNAILS_PREFIX } from '@constants/app'
import cleanObject from '@lib/cleanObject'
import humanFileSize from '@lib/human-file-size'
import transformToTree from '@lib/transform-to-tree'
import s3 from '@services/server/s3'
import db from 'db'
import { pick } from 'lodash'

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

  if (folderId === 'root' || folderId === 'files') {
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

  let [folders, files] = await Promise.all([
    db.folder.findMany({
      where: {
        AND: {
          parentId: folder.id,
          userId: userId,
          isDeleted: false
        }
      },
      include: {
        Folder: {
          select: {
            id: true
          }
        },
        File: {
          select: {
            id: true
          }
        }
      }
    }),
    db.file.findMany({
      where: {
        AND: {
          parentId: folder.id,
          userId: userId,
          isDeleted: false
        }
      }
    })
  ])

  let [filesWithSize, foldersWithChildrenCount] = await Promise.all([
    Promise.all(
      files.map(async (f: any, i) => {
        try {
          f.size = humanFileSize(f.size)
          f.type = 'file'
        } catch (err) {
        } finally {
          return f
        }
      })
    ),
    Promise.all(
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
  ])

  const content = {
    ...(!folder.isRoot ? { ...folder } : { ...folder, root: true }),
    folders: foldersWithChildrenCount,
    files: filesWithSize
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

export async function createFolder(params: {
  parentId: string
  name: string
  userId: string
}) {
  if (params.parentId === 'files' || params.parentId === 'root') {
    const folder = await getRootFolder('root', params.userId)
    params.parentId = folder.id
  }

  const folder = await db.folder.create({
    data: params
  })

  return { ...folder, type: 'folder' }
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

export async function updateFolder(
  folderId: string,
  params: { userId: string; name: string }
) {
  const folder = await db.folder.findFirst({
    where: {
      id: folderId
    },
    select: {
      userId: true
    }
  })

  if (folder.userId !== params.userId) {
    throw new Error('Forbidden')
  }

  const editableFields = ['name', 'parentId']

  const patchPayload = cleanObject(pick(params, editableFields))

  const editedFolder = await db.folder.update({
    where: {
      id: folderId
    },
    data: patchPayload
  })

  return editedFolder
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

export async function getRecentFiles(userId: string, limit?: number) {
  const files = db.file.findMany({
    where: {
      userId
    },
    take: limit || undefined,
    orderBy: {
      createdAt: 'desc'
    }
  })
  return files
}

export async function folderIsChildOf(folderId: string, parentId: string) {
  const folder = await db.$queryRaw(`
    WITH RECURSIVE cte AS(
      SELECT *, id AS topparent 
      FROM "Folder" t 
      WHERE t."parentId" = '${parentId}' -- shared folder id
    UNION ALL
      SELECT t.*, c.topparent 
      FROM "Folder" t JOIN cte c ON c.id = t."parentId"
      WHERE t.id <> t."parentId"
    )
    SELECT id FROM cte WHERE cte.id = '${folderId}' -- folder id
  `)

  return Boolean(folder)
}
