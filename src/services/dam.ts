import { ItemType } from '@typings/files'
import axios from 'axios'
import { apiClient } from './api'
import s3 from './s3'

export async function getRootFolder() {
  const { data } = await apiClient.get('dam/folder/')
  return data
}

export async function getFolder(folderId: string) {
  const { data } = await apiClient.get('dam/folder/' + folderId)
  return data
}

export async function getFile(fileId: string) {
  const { data } = await apiClient.get('dam/file/' + fileId)
  return data
}

export async function getThumbnail(key: string) {
  const file = await s3.getSignedUrl('getObject', {
    Key: 'thumbnails/' + key,
    Bucket: 'hnrk-files'
  })
  return file
}

export async function uploadFile(file: File, parentId: string, onProgress) {
  const extRe = /(?:\.([^.]+))?$/

  const name = file.name
  const extension = extRe.exec(file.name)[1]
  const mimeType = file.type?.split('/')[0]
  const mimeSubtype = file.type?.split('/')[1]

  const { data: signedRequest } = await apiClient.get('/dam/file/get-url', {
    params: {
      filename: name,
      parentId
    }
  })

  await axios.put(signedRequest.url, file, {
    onUploadProgress: onProgress
  })

  const { data: createdFile } = await apiClient.post('/dam/file/create', {
    key: signedRequest.key,
    name,
    extension,
    mimeType,
    mimeSubtype,
    parentId
  })

  return {
    file,
    key: signedRequest.key,
    name,
    extension,
    mimeType,
    mimeSubtype,
    parentId
  }
}

export async function deleteItem({ type, id }: { type: ItemType; id: string }) {
  if (type === 'file') {
    await apiClient.delete('/dam/file/' + id)
    return true
  } else if (type === 'folder') {
    await apiClient.delete('/dam/folder/' + id)
    return true
  }
}

export async function createFolder({
  parentId,
  name
}: {
  parentId: string
  name: string
}) {
  const { data: folder } = await apiClient.post('/dam/folder/', {
    parentId,
    name
  })
  return folder
}

export async function renameItem({
  id,
  type,
  newName
}: {
  id: string
  type: ItemType
  newName: string
}) {
  if (type === 'file') {
    const { data: folder } = await apiClient.patch('/dam/file/' + id, {
      name: newName
    })
    return folder
  }
}
