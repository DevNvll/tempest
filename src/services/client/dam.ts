import { ItemType } from '@typings/files'
import axios from 'axios'
import { apiClient } from './api'

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
    const { data: file } = await apiClient.patch('/dam/file/' + id, {
      name: newName
    })
    return file
  } else {
    const { data: folder } = await apiClient.patch('/dam/folder/' + id, {
      name: newName
    })
    return folder
  }
}

export async function moveItems(
  parentId: string,
  items: { folders?: string[]; files?: string[] }
) {
  const { data } = await apiClient.patch('/dam/multiple', {
    newParentId: parentId,
    ...items
  })
  return data
}

export async function deleteItems(items: {
  folders?: string[]
  files?: string[]
}) {
  const { data } = await apiClient.post('/dam/delete-multiple', items)
  return data
}
